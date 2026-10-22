import 'server-only';
import {cookies} from 'next/headers';
import {createHmac,timingSafeEqual} from 'node:crypto';

const cookieName='lar_em_dia_access';
const accountId='family:israelelaisa';
const maxAge=7*24*60*60;
function key(){
 const seed=process.env.NEON_AUTH_COOKIE_SECRET||process.env.DATABASE_URL||process.env.POSTGRES_URL;
 if(!seed)throw Error('Não foi possível configurar a sessão.');
 return createHmac('sha256',seed).update('lar-em-dia/family-session/v1').digest();
}
function mac(text){return createHmac('sha256',key()).update(text).digest('base64url')}
export async function familySession(){
 const raw=(await cookies()).get(cookieName)?.value;
 if(!raw)return null;
 const [payload,tag,extra]=raw.split('.');
 if(!payload||!tag||extra)return null;
 const given=Buffer.from(tag),expected=Buffer.from(mac(payload));
 if(given.length!==expected.length||!timingSafeEqual(given,expected))return null;
 try{
  const data=JSON.parse(Buffer.from(payload,'base64url').toString('utf8'));
  if(data.user===accountId&&Number.isSafeInteger(data.expires)&&data.expires>Date.now())return {id:accountId,name:'Israel e Laísa'};
 }catch{}
 return null;
}
export async function startFamilySession(){
 const payload=Buffer.from(JSON.stringify({user:accountId,expires:Date.now()+maxAge*1000})).toString('base64url');
 (await cookies()).set(cookieName,payload+'.'+mac(payload),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge});
}
export async function endFamilySession(){(await cookies()).delete(cookieName)}
