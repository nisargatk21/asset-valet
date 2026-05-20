import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("railway")
    ? false
    : { rejectUnauthorized: false },
  max: 3,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
  allowExitOnIdle: true,
});

export async function query(text: string, params?: unknown[]) {
  let retries = 3;
  while (retries > 0) {
    try {
      const client = await pool.connect();
      try {
        return await client.query(text, params);
      } finally {
        client.release();
      }
    } catch (err: unknown) {
      retries--;
      if (retries === 0) throw err;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  throw new Error("Database connection failed");
}

export default pool;