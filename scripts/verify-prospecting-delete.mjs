import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'
import { z } from 'zod'
const source = stripTypeScriptTypes(readFileSync(new URL('../server/api/prospecting/leads/[id].delete.ts', import.meta.url), 'utf8')).replace(/^import .*$/gm, '').replace('export default ', 'return ')
const id = 'b4a80171-4a00-4bc5-8447-f678a3d672b0'
const event = { id, body: { expected_updated_at: '2026-09-30T12:00:00.000Z' } }
let calls = []
let member = { user_id: id }
let memberError = null
let rpcResult = { data: true, error: null }
let authenticated = true
const admin = {
  from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({data:member,error:memberError}) }) }) }),
  rpc: async (...args) => { calls.push(args); return rpcResult },
}
const handler = new Function('z','createClient','getAuthenticatedUser','defineEventHandler','getRouterParam','readBody','createError', source)(z, () => admin, async () => {if(!authenticated)throw Object.assign(new Error('Login necessário'),{statusCode:401}); return {id}}, value=>value, e=>e.id, async e=>e.body, options=>Object.assign(new Error(options.statusMessage),options))
assert.deepEqual(await handler(event), {deleted:true,id})
assert.equal(calls[0][0], 'prospecting_delete_lead')
assert.deepEqual(calls[0][1], {p_lead_id:id,p_expected_updated_at:event.body.expected_updated_at})
calls=[]; member=null
await assert.rejects(handler(event), {statusCode:403}); assert.equal(calls.length,0)
member={user_id:id}; authenticated=false
await assert.rejects(handler(event), {statusCode:401}); assert.equal(calls.length,0)
authenticated=true
await assert.rejects(handler({...event,id:'invalid'}),{statusCode:400})
await assert.rejects(handler({...event,body:{}}),{statusCode:400})
assert.equal(calls.length,0)
memberError={message:'database unavailable'}
await assert.rejects(handler(event),{statusCode:500}); assert.equal(calls.length,0)
memberError=null
for(const [code,statusCode] of [['40001',409],['PGRST202',503],['42883',503],['23503',500]]) {
  rpcResult={data:null,error:{code}}; await assert.rejects(handler(event),{statusCode})
}
rpcResult={data:false,error:null}
assert.deepEqual(await handler(event),{deleted:false,id})
console.log('OK: exclusão autenticada, acesso restrito, validação, conflito, migration ausente, falha e repetição.')
