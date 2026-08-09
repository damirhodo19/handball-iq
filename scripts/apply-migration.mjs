/**
 * Apply a Supabase migration SQL file via direct Postgres connection.
 * Usage: SUPABASE_DB_PASSWORD=... node scripts/apply-migration.mjs [migration-file]
 */
import pg from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

const linkedRef = (() => {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), 'supabase/.temp/project-ref'), 'utf8').trim());
  } catch {
    try {
      return JSON.parse(readFileSync(join(process.cwd(), 'supabase/.temp/linked-project.json'), 'utf8')).ref;
    } catch {
      return 'kcirngycafwooavgyymz';
    }
  }
})();
const ref = process.env.SUPABASE_PROJECT_REF || (typeof linkedRef === 'string' ? linkedRef : linkedRef);
const password = process.env.SUPABASE_DB_PASSWORD || process.env.DATABASE_PASSWORD;
const file = process.argv[2] || join(process.cwd(), 'supabase/migrations/20260807150000_sprint4_development_persistence.sql');

if (!password) {
  console.error('Missing SUPABASE_DB_PASSWORD');
  process.exit(1);
}

const sql = readFileSync(file, 'utf8').replace(/^\/\*[\s\S]*?\*\//, '').trim();
const client = new pg.Client({
  host: `db.${ref}.supabase.co`,
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
await client.query('BEGIN');
try {
  await client.query(sql);
  await client.query('COMMIT');
  console.log('Migration applied:', file);
} catch (e) {
  await client.query('ROLLBACK');
  console.error('Migration failed:', e.message);
  process.exit(1);
} finally {
  await client.end();
}
