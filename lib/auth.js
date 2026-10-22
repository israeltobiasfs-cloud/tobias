import 'server-only';
import {createNeonAuth} from '@neondatabase/auth/next/server';
import {createHash} from 'node:crypto';
let instance;
export function auth(){
 const baseUrl=process.env.NEON_AUTH_BASE_URL||process.env.VITE_NEON_AUTH_URL,databaseUrl=process.env.DATABASE_URL||process.env.POSTGRES_URL;
 if(!baseUrl || !databaseUrl) throw new Error('Autenticação não configurada.');
 return instance ||= createNeonAuth({baseUrl,cookies:{secret:process.env.NEON_AUTH_COOKIE_SECRET || createHash('sha256').update('lar-em-dia/session/v1:'+databaseUrl).digest('hex'),sessionDataTtl:0},logLevel:'silent'});
}
export async function user(){const {data}=await auth().getSession(); if(!data?.user?.id) throw new Error('UNAUTHORIZED'); return data.user;}
