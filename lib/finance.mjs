export const money=n=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format((n||0)/100);
export function cents(s){const v=String(s).replace(/R\$|\s/g,'').replace(/\./g,'').replace(',','.');const n=Number(v);if(!/^-?\d+(?:\.\d{1,2})?$/.test(v)||!Number.isFinite(n))throw new Error('Valor inválido');return Math.round(n*100)}
export function today(){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo'}).format(new Date())}
export function schedule({balance,rate,months,system},extra=0,strategy='term'){
 let b=Math.max(0,balance-extra),i=rate/100, interest=0;const start=b,rows=[];
 const basePayment=i===0?balance/months:balance*i/(1-Math.pow(1+i,-months));
 const payment=strategy==='payment'?(i===0?b/months:b*i/(1-Math.pow(1+i,-months))):basePayment;
 const principal= (strategy==='payment'?b:balance)/months;
 for(let n=1;n<=months&&b>0.5;n++){const j=Math.round(b*i),p=n===months?b:Math.min(b,Math.max(0,Math.round(system==='SAC'?principal:payment-j)));if(p<=0)break;b=Math.max(0,b-p);interest+=j;rows.push({month:n,principal:p,interest:j,payment:p+j,balance:b});}
 return {rows,interest,months:rows.length,payment:rows[0]?.payment||0,balance:b,amortized:start-b};
}
export function accountBalance(account,transactions,until=today()){return account.data.opening+transactions.filter(t=>t.data.status==='paid'&&t.data.date>=account.data.date&&t.data.date<=until).reduce((n,{data:d})=>n+(d.account===account.id?(d.type==='income'?d.amount:-d.amount):0)+(d.type==='transfer'&&d.destination===account.id?d.amount:0),0)}
export function loanBalance(loan,transactions){return Math.max(0,loan.balance-transactions.filter(t=>t.data.status==='paid'&&t.data.date>loan.date&&t.data.date<=today()).reduce((n,t)=>n+(t.data.principal||0),0))}
export function parseReceipt(t){const total=t.match(/(?:total(?:\s+a\s+pagar)?|valor(?:\s+total)?)\s*[:=]?\s*(?:R\$\s*)?(\d[\d.]*,\d{2})/i);const currency=t.match(/R\$\s*(\d[\d.]*,\d{2})/);const spoken=t.match(/(\d+(?:[.,]\d{1,2})?)\s*reais/i);const raw=total?.[1]||currency?.[1]||spoken?.[1];return {amount:raw?raw.replace(/\.(?=\d{1,2}$)/,','):'',title:t.split('\n').find(s=>s.trim().length>3)?.trim().slice(0,100)||'',notes:t.slice(0,3000)}}

export function monthlyTotals(transactions,month,person='all'){return Array.from({length:6},(_,k)=>{const d=new Date(month+'-15T12:00:00Z');d.setUTCMonth(d.getUTCMonth()-(5-k));const m=d.toISOString().slice(0,7),items=transactions.filter(t=>t.data.date.startsWith(m)&&t.data.status==='paid'&&(person==='all'||t.data.person===person));return {month:m,label:d.toLocaleDateString('pt-BR',{month:'short',timeZone:'UTC'}).replace('.',''),income:items.filter(t=>t.data.type==='income').reduce((n,t)=>n+t.data.amount,0),expense:items.filter(t=>t.data.type==='expense').reduce((n,t)=>n+t.data.amount,0)}})}
