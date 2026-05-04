import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient | null = null;
let initPromise: Promise<void> | null = null;

function getDbUrl(): string {
  const url = process.env.DATABASE_URL || 'file:./dev.db';
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    return 'file:/tmp/dev.db';
  }
  return url;
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
  if (process.env.NODE_ENV !== 'production' || process.env.VERCEL) {
    globalForPrisma.prisma = prismaInstance;
  }
  return prismaInstance;
}

async function ensureDb() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      const { ensureDatabase } = await import('@/lib/db-init');
      await ensureDatabase();
    } catch {
      // db-init might not be available in all contexts
    }
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
