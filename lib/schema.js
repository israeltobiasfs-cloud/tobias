import {z} from 'zod';
const text=z.string().trim().min(1).max(150), cents=z.number().int().min(0).max(100000000000), date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(s=>{const d=new Date(s+'T12:00:00Z');return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===s});
export const schemas={
 transaction:z.object({title:text,amount:cents.refine(n=>n>0),type:z.enum(['expense','income','transfer']),date,status:z.enum(['paid','pending']),category:text,person:text,account:z.string().uuid(),destination:z.string().uuid().optional(),notes:z.string().max(3000).default(''),principal:cents.default(0)}).superRefine((x,c)=>{if(x.type==='transfer'&&(!x.destination||x.destination===x.account))c.addIssue({code:'custom',message:'Selecione contas diferentes'});if(x.principal>x.amount||x.principal>0&&(x.type!=='expense'||x.category!=='Terreno'))c.addIssue({code:'custom',message:'Amortização inválida'});}),
 account:z.object({name:text,opening:z.number().int().min(-100000000000).max(100000000000),date}),
 goal:z.object({name:text,target:cents.refine(x=>x>0),saved:cents,date}),
 budget:z.object({category:text,amount:cents.refine(x=>x>0),month:z.string().regex(/^\d{4}-\d{2}$/)}),
 loan:z.object({name:text,balance:cents.refine(x=>x>0),date,rate:z.number().min(0).max(20),months:z.number().int().min(1).max(600),system:z.enum(['PRICE','SAC']),fees:cents.default(0)})
};
