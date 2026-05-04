import fs from 'fs';
import path from 'path';

function getDbPath(): string {
  const url = process.env.DATABASE_URL || 'file:./dev.db';
  return url.replace('file:', '');
}

function resolvePrismaDir(): string {
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, 'prisma'),
    path.join(cwd, '.next', 'standalone', 'prisma'),
    path.join(cwd, '..', 'prisma'),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  return path.join(cwd, 'prisma');
}

let dbReady = false;

export async function ensureDatabase() {
  if (dbReady) return;

  const dbPath = getDbPath();
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const prismaDir = resolvePrismaDir();
  const sqlPath = path.join(prismaDir, 'schema.sql');

  if (!fs.existsSync(sqlPath)) {
    dbReady = true;
    return;
  }

  const { PrismaClient } = await import('@prisma/client');
  const tempClient = new PrismaClient({
    datasources: { db: { url: `file:${dbPath}` } },
    log: [],
  });

  try {
    await tempClient.$connect();
    const result = await tempClient.$queryRawUnsafe<Array<{ name: string }>>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
    );
    if (!result || result.length === 0) {
      const initSql = fs.readFileSync(sqlPath, 'utf-8');
      const statements = initSql
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      for (const stmt of statements) {
        try {
          await tempClient.$executeRawUnsafe(`${stmt};`);
        } catch {
          // Table might already exist from a previous partial run
        }
      }
    }
  } finally {
    await tempClient.$disconnect();
  }

  dbReady = true;
}
