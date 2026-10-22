'use client';
import {useState} from 'react';
import {authClient} from '../../lib/auth-client';
import {ArrowRight,House,ShieldCheck,Sprout} from 'lucide-react';

export default function Login(){
 const [mode,setMode]=useState('family'),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 async function submit(e){
  e.preventDefault();setBusy(true);setError('');
  const f=new FormData(e.currentTarget);
  try{
   if(mode==='family'){
    const res=await fetch('/api/access',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:f.get('username'),password:f.get('password')})});
    const data=await res.json();
    if(!res.ok)throw Error(data.error||'Não foi possível entrar');
   }else{
    const fields={email:f.get('email'),password:f.get('password')};
    const r=mode==='up'?await authClient.signUp.email({...fields,name:f.get('name')}):await authClient.signIn.email(fields);
    if(r.error)throw Error(r.error.message||'Não foi possível entrar');
   }
   window.location.href='/';
  }catch(err){setError(err.message)}finally{setBusy(false)}
 }
 return <div className="login-page">
  <section className="login-story"><a className="brand" href="/"><span className="brand-icon"><House/></span>lar<span>em dia</span></a><div><span className="eyebrow">FINANÇAS A DOIS</span><h1>Mais clareza hoje.<br/>Mais planos<br/><em>realizados amanhã.</em></h1><p>Organizem as contas, acompanhem o terreno e construam o próximo capítulo. Juntos.</p></div><span className="login-foot"><Sprout size={18}/> Um passo de cada vez. Na mesma direção.</span></section>
  <section className="login-form"><div><span className="eyebrow">BEM-VINDOS AO LAR EM DIA</span><h2>{mode==='up'?'Comece seu novo capítulo':'Seu lar, suas conquistas.'}</h2><p className="muted">{mode==='family'?'Use o acesso compartilhado do casal.':mode==='up'?'Crie sua conta. Depois, conecte o casal com um código de convite.':'Entre para acompanhar o que importa.'}</p>
   <form onSubmit={submit}>
    {mode==='up'&&<label>Seu nome<input name="name" autoComplete="name" required maxLength={80}/></label>}
    {mode==='family'?<label>Usuário<input name="username" autoComplete="username" defaultValue="israelelaisa" required/></label>:<label>E-mail<input type="email" name="email" autoComplete="email" required/></label>}
    <label>Senha<input type="password" name="password" autoComplete={mode==='up'?'new-password':'current-password'} required minLength={mode==='family'?1:8}/></label>
    {error&&<p role="alert" className="error">{error}</p>}
    <button className="primary wide" disabled={busy}>{busy?'Aguarde…':mode==='up'?'Criar minha conta':'Entrar no meu lar'}<ArrowRight size={18}/></button>
   </form>
   <button className="text-btn wide" onClick={()=>{setMode(mode==='family'?'in':'family');setError('')}}>{mode==='family'?'Entrar com e-mail':'Entrar com usuário do casal'}</button>
   {mode!=='family'&&<button className="text-btn wide" onClick={()=>{setMode(mode==='up'?'in':'up');setError('')}}>{mode==='up'?'Já tenho uma conta':'Primeiro acesso? Criar conta'}</button>}
   <p className="secure"><ShieldCheck size={16}/> Seus registros ficam no seu espaço privado.</p></div>
  </section>
 </div>
}