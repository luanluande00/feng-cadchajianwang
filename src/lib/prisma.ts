import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient | null = null;
let initPromise: Promise<void> | null = null;

function isPlatformDeploy(): boolean {
  return !!(process.env.VERCEL || process.env.NETLIFY || process.env.RENDER);
}

function getDbUrl(): string {
  if (isPlatformDeploy()) {
    return 'file:/tmp/dev.db';
  }
  return process.env.DATABASE_URL || 'file:./dev.db';
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    datasources: { db: { url: getDbUrl() } },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

function getPrismaClient(): PrismaClient {
  if (prismaInstance) return prismaInstance;
  if (globalForPrisma.prisma) {
    prismaInstance = globalForPrisma.prisma;
    return prismaInstance;
  }
  prismaInstance = createPrismaClient();
  if (process.env.NODE_ENV !== 'production' || isPlatformDeploy()) {
    globalForPrisma.prisma = prismaInstance;
  }
  return prismaInstance;
}

async function ensureDb() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    const { ensureDatabase } = await import('@/lib/db-init');
    await ensureDatabase();
  })();
  return initPromise;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop: string) {
    const client = getPrismaClient();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return (...args: any[]) => {
        return (async () => {
          await ensureDb();
          return value.apply(client, args);
        })().catch((error: any) => {
          console.error(`Prisma error (${prop}):`, error?.message || error);
          throw error;
        });
      };
    }
    return value;
  },
});

export default prisma;
