import fs from 'fs';
import path from 'path';

function getDbPath(): string {
  const url = process.env.DATABASE_URL || 'file:./dev.db';
  return url.replace('file:', '');
}

let dbReady = false;

const CREATE_TABLES_SQL = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar TEXT,
  points INTEGER NOT NULL DEFAULT 0,
  totalEarned INTEGER NOT NULL DEFAULT 0,
  role TEXT NOT NULL DEFAULT 'USER',
  isVerified INTEGER NOT NULL DEFAULT 0,
  verifyToken TEXT,
  verifyTokenExpiry DATETIME,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  parentUserId TEXT,
  FOREIGN KEY (parentUserId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS plugins (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  coverImage TEXT NOT NULL DEFAULT '',
  fileUrl TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  downloads INTEGER NOT NULL DEFAULT 0,
  userId TEXT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_plugins_userId ON plugins(userId);
CREATE INDEX IF NOT EXISTS idx_plugins_status ON plugins(status);

CREATE TABLE IF NOT EXISTS downloads (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  pluginId TEXT NOT NULL,
  pointsSpent INTEGER NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (pluginId) REFERENCES plugins(id)
);

CREATE INDEX IF NOT EXISTS idx_downloads_userId ON downloads(userId);
CREATE INDEX IF NOT EXISTS idx_downloads_pluginId ON downloads(pluginId);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_transactions_userId ON transactions(userId);

CREATE TABLE IF NOT EXISTS payment_orders (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  amount INTEGER NOT NULL,
  points INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  paymentUrl TEXT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_payment_orders_userId ON payment_orders(userId);
CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON payment_orders(status);
`;

export async function ensureDatabase() {
  if (dbReady) return;

  const dbPath = getDbPath();
  const dbDir = path.dirname(dbPath);

  try {
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
  } catch (e) {
    console.error('Cannot create db directory:', dbDir, e);
  }

  try {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, '');
    }
  } catch (e) {
    console.error('Cannot create db file at', dbPath, e);
    dbReady = true;
    return;
  }

  const { PrismaClient } = await import('@prisma/client');
  const tempClient = new PrismaClient({
    datasources: { db: { url: `file:${dbPath}` } },
    log: ['error'],
  });

  try {
    try {
      await tempClient.$connect();
    } catch (e) {
      console.error('Prisma connect failed:', e);
    }

    const result = await tempClient.$queryRawUnsafe<Array<{ name: string }>>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
    );

    if (!result || result.length === 0) {
      const statements = CREATE_TABLES_SQL
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const stmt of statements) {
        await tempClient.$executeRawUnsafe(`${stmt};`);
      }
    }
  } catch (error) {
    console.error('Database init error:', error);
    throw error;
  } finally {
    await tempClient.$disconnect();
  }

  dbReady = true;
}
