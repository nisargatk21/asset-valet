import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

export async function query(text: string, params?: unknown[]) {
  const client = await pool.connect();
  try { return await client.query(text, params); }
  finally { client.release(); }
}

export default pool;