import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'
import { z } from 'zod'
import { createJiti } from 'jiti'
const j=createJiti(import.meta.url,{alias:{'~':`${process.cwd()}/app`}})
const {newProspect}=await j.import('../app/utils/prospecting.ts')
const {prospectSchema}=await j.import('../app/validation/prospecting.ts')
const {prospectToDbRow}=await j.import('../app/utils/prospecting-row.ts')
const source=stripTypeScriptTypes(readFileSync(new URL('../server/api/prospecting/import.post.ts',import.meta.url),'utf8')).replace(/^import .*$/gm,'').replace('export default ','return ')
const record={...newProspect(),company:'Empresa teste',city:'Recife',segment:'Vidros',contactStatus:'Não atendeu',contactTime:'10:15',history:[{id:crypto.randomUUID(),date:'2026-10-02',channel:'Telefone',stage:'Contatado',note:'Tentativa',time:'10:15',status:'Não atendeu',createdAt:'2026-10-02T13:15:00.000Z'}]}
let member={user_id:'user'},rpcError=null,calls=[]
const admin={from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:member,error:null})})})}),rpc:async(...args)=>{calls.push(args);return {data:{imported_leads:1,imported_interactions:1},error:rpcError}}}
const handler=new Function('z','createClient','getAuthenticatedUser','prospectSchema','prospectToDbRow','defineEventHandler','readBody','createError',source)(z,()=>admin,async()=>({id:'user'}),prospectSchema,prospectToDbRow,x=>x,async x=>x,options=>Object.assign(new Error(options.statusMessage),options))
assert.deepEqual(await handler({leads:[record]}),{imported_leads:1,imported_interactions:1})
const row=calls[0][1].p_leads[0]
assert.equal(row.contact_status,'Não atendeu');assert.equal(row.contact_time,'10:15')
assert.equal(row.created_at,record.createdAt)
assert.equal(row.interactions[0].contact_time,'10:15');assert.equal(row.interactions[0].created_at,record.history[0].createdAt)
calls=[];member=null
await assert.rejects(handler({leads:[record]}),{statusCode:403});assert.equal(calls.length,0)
member={user_id:'user'}
await assert.rejects(handler({leads:[record,record]}),{statusCode:400});assert.equal(calls.length,0)
await assert.rejects(handler({leads:[{...record,rating:9}]}),{statusCode:400});assert.equal(calls.length,0)
rpcError={code:'PGRST202'};await assert.rejects(handler({leads:[record]}),{statusCode:503})
rpcError={code:'23505',message:'Importação bloqueada: empresa já cadastrada, telefone em comum.'};await assert.rejects(handler({leads:[record]}),{statusCode:409,message:rpcError.message})
console.log('OK: API valida acesso, lote e histórico; preserva status, horários e datas; trata migration ausente e falha de transação.')
