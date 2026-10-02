import assert from 'node:assert/strict'
import { createJiti } from 'jiti'
const jiti=createJiti(import.meta.url,{alias:{'~':`${process.cwd()}/app`}})
const {newProspect}=await jiti.import('../app/utils/prospecting.ts')
const {normalizeImport,readProspectImport}=await jiti.import('../app/services/prospecting-import.ts')
const {buildProspectExport,createProspectWorkbook}=await jiti.import('../app/services/prospecting-export.ts')
const original={...newProspect(),company:'Vidros São Paulo',city:'Santo André',segment:'Vidros',phone:'+55 11 99999-1234',additionalPhones:['00123456789','+55 11 98888-2222'],rating:4.5,reviewCount:10,archived:true,goodReviews:true,contactStatus:'Não atendeu',contactTime:'09:30',importedAt:'2026-10-02T12:00:00.000Z',notes:'Texto completo\nSegunda linha',proposalValue:1500.25,history:[{id:crypto.randomUUID(),date:'2026-10-01',channel:'Telefone',stage:'Contatado',note:'Não atendeu\nNova tentativa amanhã',time:'09:30',status:'Não atendeu',createdAt:'2026-10-01T12:30:00.000Z'}]}
const second={...newProspect(),company:'Outra empresa',city:'São Paulo',segment:'Indústria'}
for(const payload of [original,[original],buildProspectExport({leads:[original],scope:'company'})]) {
 const parsed=await readProspectImport(new File([JSON.stringify(payload)],'cadastros.json'))
 assert.deepEqual(parsed.leads,[original])
}
const workbook=await createProspectWorkbook(buildProspectExport({leads:[original,second],settings:{target:40,budget:200},scope:'all'}))
const bytes=await workbook.xlsx.writeBuffer()
const parsed=await readProspectImport(new File([bytes],'cadastros.xlsx'))
assert.deepEqual(parsed.leads,[original,second])
const minimal=normalizeImport([{company:'Nova empresa',city:'Recife',segment:'Vidros'}])
assert.ok(minimal.leads[0].id);assert.equal(minimal.leads[0].contactStatus,undefined)
assert.throws(()=>normalizeImport([{company:'A'}]),/Cadastro 1/)
assert.throws(()=>normalizeImport([original,original]),/duplicado/)
assert.throws(()=>normalizeImport({...original,rating:8}),/rating/)
assert.throws(()=>normalizeImport({...original,wrongField:'valor'}),/desconhecidos/)
await assert.rejects(readProspectImport({size:10_000_001,name:'cadastros.json'}),/10 MB/)
await assert.rejects(readProspectImport(new File(['abc'],'arquivo.xls')),/não é suportado/)
workbook.getWorksheet('Empresas').getCell('B2').value={formula:'1+1',result:2}
await assert.rejects(readProspectImport(new File([await workbook.xlsx.writeBuffer()],'formula.xlsx')),/Fórmula/)
console.log('OK: importação individual/lote, JSON e XLSX preservam todos os campos e históricos, IDs, validação e fórmulas.')
