import {user} from '../../../lib/auth';
import {db,member,failure,originCheck} from '../../../lib/db';
import {randomUUID,randomBytes,createHash} from 'node:crypto';
const hash=v=>createHash('sha256').update(v).digest('hex');
export async function POST(r){try{originCheck(r);const u=await user(),s=db(),body=await r.json(),m=await member(u.id);
 if(body.action==='create'){
 if(m)throw new Error('Already member');const name=String(body.name||'Nosso lar').trim().slice(0,80),id=randomUUID();
 await s.transaction([s`INSERT INTO households(id,name) VALUES(${id},${name})`,s`INSERT INTO members(user_id,household_id,name,role) VALUES(${u.id},${id},${u.name||'Pessoa'},'owner')`]);return Response.json({ok:true});}
 if(body.action==='invite'){
 if(!m||m.role!=='owner')throw new Error('Not owner');const token=randomBytes(24).toString('hex');
 await s.transaction([s`DELETE FROM invites WHERE household_id=${m.id}`,s`INSERT INTO invites(token_hash,household_id,expires_at) VALUES(${hash(token)},${m.id},now()+interval '24 hours')`]);return Response.json({code:token});}
 if(body.action==='join'){
 if(m||!(/^[a-f0-9]{48}$/.test(body.code||'')))throw new Error('Invalid code');
 const rows=await s`WITH used AS (UPDATE invites SET used_at=now() WHERE token_hash=${hash(body.code)} AND used_at IS NULL AND expires_at>now() RETURNING household_id) INSERT INTO members(user_id,household_id,name,role) SELECT ${u.id},household_id,${u.name||'Pessoa'},'member' FROM used RETURNING user_id`;
 if(!rows.length)throw new Error('Expired invite');return Response.json({ok:true});}
 throw new Error('Invalid action');
 }catch(e){return failure(e)}}
