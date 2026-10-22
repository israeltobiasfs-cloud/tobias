import {readFileSync} from 'node:fs';
import {neon} from '@neondatabase/serverless';
process.loadEnvFile('.env.local');
const sql=neon(process.env.DATABASE_URL);
for(const statement of readFileSync('scripts/schema.sql','utf8').split(';').filter(x=>x.trim()))await sql.query(statement);
console.log('Schema ready');
