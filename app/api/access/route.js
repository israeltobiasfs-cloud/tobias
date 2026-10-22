import {createHash,timingSafeEqual} from 'node:crypto';
import {startFamilySession,endFamilySession} from '../../../lib/family-session';
import {originCheck} from '../../../lib/db';

function equal(a,b){const x=createHash('sha256').update(a).digest(),y=createHash('sha256').update(b).digest();return timingSafeEqual(x,y)}
export async function POST(request){
 try{
  originCheck(request);
  const body=await request.json();
  const username=typeof body.username==='string'?body.username.trim().toLowerCase():'';
  const password=typeof body.password==='string'?body.password:'';
  const expected=process.env.APP_ACCESS_PASSWORD;
  if(!expected)return Response.json({error:'O acesso pelo nome de usuário ainda não foi ativado no servidor.'},{status:503});
  if(username!=='israelelaisa'||!equal(password,expected))return Response.json({error:'Usuário ou senha inválidos.'},{status:401});
  await startFamilySession();
  return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'Não foi possível entrar. Tente novamente.'},{status:400})}
}
export async function DELETE(request){
 try{originCheck(request);await endFamilySession();return Response.json({ok:true})}
 catch{return Response.json({error:'Não foi possível sair.'},{status:400})}
}
