import 'server-only';
import {neon} from '@neondatabase/serverless';
export function db(){const url=process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!url)throw new Error('Banco não configurado');return neon(url)}
export async function member(uid){const s=db();const rows=await s`SELECT h.id,h.name,m.role FROM households h JOIN members m ON h.id=m.household_id WHERE m.user_id=${uid}`;return rows[0]||null}
export function failure(e){if(e.code==='23505')return Response.json({error:'Já existe um contrato ou limite para esta categoria e mês. Edite o registro existente.'},{status:409});if(e.message==='UNAUTHORIZED')return Response.json({error:'Entre na sua conta para continuar.'},{status:401}); console.error('Request failed',e.name);return Response.json({error:e.name==='ZodError'?'Confira os campos preenchidos.':'Não foi possível concluir. Tente novamente.'},{status:400})}
export function originCheck(r){const o=r.headers.get('origin');if(!o || o!==new URL(r.url).origin)throw new Error('Invalid origin')}
