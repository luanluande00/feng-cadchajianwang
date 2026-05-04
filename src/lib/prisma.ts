import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDbUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  if (process.env.NODE_ENV === 'production') return 'file:/tmp/dev.db';
  return 'file:./dev.db';
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    datasources: { db: { url: getDbUrl() } },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const client = createPrismaClient();
  globalForPrisma.prisma = client;
  return client;
}

const INIT_SQL = `
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL, avatar TEXT, points INTEGER NOT NULL DEFAULT 0,
  totalEarned INTEGER NOT NULL DEFAULT 0, role TEXT NOT NULL DEFAULT 'USER',
  isVerified INTEGER NOT NULL DEFAULT 0, verifyToken TEXT,
  verifyTokenExpiry DATETIME, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, parentUserId TEXT
);
CREATE TABLE IF NOT EXISTS plugins (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL,
  coverImage TEXT NOT NULL DEFAULT '', fileUrl TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL, category TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'PENDING',
  downloads INTEGER NOT NULL DEFAULT 0, userId TEXT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS downloads (
  id TEXT PRIMARY KEY, userId TEXT NOT NULL, pluginId TEXT NOT NULL,
  pointsSpent INTEGER NOT NULL, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY, userId TEXT NOT NULL, type TEXT NOT NULL,
  amount INTEGER NOT NULL, description TEXT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS payment_orders (
  id TEXT PRIMARY KEY, userId TEXT NOT NULL, amount INTEGER NOT NULL,
  points INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'PENDING',
  paymentUrl TEXT, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY, key TEXT UNIQUE NOT NULL, value TEXT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

const actualPrisma = getPrismaClient();

let initStarted = false;
let initDone = false;
let initError: Error | null = null;
let initWaiters: Array<{ resolve: () => void; reject: (e: Error) => void }> = [];

async function doInit() {
  if (initDone) return;
  if (initError) throw initError;
  if (initStarted) {
    return new Promise<void>((resolve, reject) => {
      initWaiters.push({ resolve, reject });
    });
  }
  initStarted = true;
  try {
    const result = await actualPrisma.$queryRawUnsafe<Array<{ name: string }>>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
    );
    if (!result || result.length === 0) {
      const stmts = INIT_SQL
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      for (const stmt of stmts) {
        await actualPrisma.$executeRawUnsafe(`${stmt};`);
      }
      console.log('Database tables created');
    }
    initDone = true;
    initWaiters.forEach((w) => w.resolve());
    initWaiters = [];
  } catch (e) {
    initError = e instanceof Error ? e : new Error(String(e));
    initWaiters.forEach((w) => w.reject(initError!));
    initWaiters = [];
    initStarted = false;
    throw initError;
  }
}

function ensureInit(): Promise<void> | void {
  if (initDone) return;
  return doInit();
}

export const prisma = new Proxy(actualPrisma, {
  get(target, prop: string) {
    if (prop === 'then') return undefined;
    const value = (target as any)[prop];
    if (value && typeof value === 'object') {
      const initResult = ensureInit();
      if (!initResult) return value;
      return new Proxy(value, {
        get(nestedTarget, nestedProp: string) {
          const nestedValue = nestedTarget[nestedProp];
          if (typeof nestedValue === 'function') {
            return (...args: any[]) => {
              const r = ensureInit();
              if (r) {
                return r.then(() => nestedValue.apply(nestedTarget, args));
              }
              return nestedValue.apply(nestedTarget, args);
            };
          }
          return nestedValue;
        },
      });
    }
    if (typeof value === 'function') {
      return (...args: any[]) => {
        const r = ensureInit();
        if (r) {
          return r.then(() => value.apply(target, args));
        }
        return value.apply(target, args);
      };
    }
    return value;
  },
});

export default prisma;
