import assert from 'node:assert/strict'
import { createJiti } from 'jiti'
import ExcelJS from 'exceljs'
const jiti = createJiti(import.meta.url, { alias: { '~': `${process.cwd()}/app` } })
const { newProspect } = await jiti.import('../app/utils/prospecting.ts')
const { buildProspectExport, createProspectWorkbook, prospectFieldLabels } = await jiti.import('../app/services/prospecting-export.ts')
const { collectProspectingRows } = await jiti.import('../server/utils/prospecting-pagination.ts')
const company = {...newProspect(), company: '=EMPRESA teste', contactStatus: 'Não atendeu', contactTime: '09:30', importedAt: '2026-10-02T12:00:00.000Z', city: 'Santo André', segment: 'Vidros', person: 'João', phone: '+55 38 9192-1122', additionalPhones: ['+55 11 99999-1234', '00351212345678'], notes: 'Observação completa\ncom acentos e emoji 🪟', rating: null, reviewCount: 0, archived: true, proposalValue: 1234.56, monthlyValue: 90, history: [{id:'interaction-1',date:'2026-09-30',channel:'WhatsApp',stage:'Respondeu',note:'=texto literal\nSegunda linha'}]}
const input={leads:[company],settings:{target:30,budget:200},scope:'all'}
const json=buildProspectExport(input)
assert.deepEqual(JSON.parse(JSON.stringify(json)).leads, input.leads)
assert.deepEqual(json.settings,input.settings)
assert.deepEqual(Object.keys(prospectFieldLabels).sort(),Object.keys(company).sort())
company.company='Alteração posterior'
assert.equal(json.leads[0].company,'=EMPRESA teste')
const wb=await createProspectWorkbook(json)
const bytes=await wb.xlsx.writeBuffer()
const read=new ExcelJS.Workbook();await read.xlsx.load(bytes)
const main=read.getWorksheet('Empresas')
const keyValues = Object.fromEntries(main.getRow(1).values.slice(1).map((header,index)=>[header.match(/\[([^\]]+)\]$/)[1],main.getRow(2).getCell(index+1).value]))
for(const [key,value] of Object.entries(json.leads[0])) {
  if(['history','additionalPhones'].includes(key))continue
  assert.deepEqual(keyValues[key], value, key)
}
assert.equal(main.getRow(2).getCell(main.getRow(1).values.findIndex(value => String(value).endsWith('[company]'))).type,ExcelJS.ValueType.String)
const phones=read.getWorksheet('Telefones')
assert.equal(phones.rowCount,4)
assert.equal(phones.getRow(4).getCell(5).value,'00351212345678')
assert.equal(read.getWorksheet('Historico').getRow(2).getCell(8).value,json.leads[0].history[0].note)
assert.equal(read.getWorksheet('Configuracoes').rowCount,3)
assert.equal(read.worksheets.length,7)
const draft=buildProspectExport({leads:[{...company,company:'',rating:'',additionalPhones:['']}],scope:'draft'})
assert.equal(draft.unsavedDraft,true)
assert.equal(draft.leads[0].rating,'')
assert.deepEqual(draft.leads[0].additionalPhones,[''])
assert.equal('settings' in draft,false)
const empty=await createProspectWorkbook(buildProspectExport({leads:[],scope:'all',settings:{target:30,budget:0}}))
assert.equal(empty.getWorksheet('Empresas').rowCount,1)
// A history larger than an Excel cell must be preserved in separate rows, never truncated.
const many=await createProspectWorkbook(buildProspectExport({leads:[{...company,history:Array.from({length:20},(_,i)=>({...company.history[0],id:String(i),note:'x'.repeat(4000)}))}],scope:'company'}))
assert.equal(many.getWorksheet('Historico').rowCount,21)
const source=Array.from({length:1251},(_,id)=>({id}));let calls=0
const all=await collectProspectingRows(async(from,to)=>{calls++;return {data:source.slice(from,Math.min(to+1,from+100)),error:null}})
assert.deepEqual(all,source);assert.equal(calls,14)
await assert.rejects(collectProspectingRows(async()=>({data:null,error:new Error('database failed')})),/database failed/)
console.log('OK: todos os campos JSON/Excel, telefones como texto, histórico, arquivadas, rascunhos, fórmulas literais e paginação além de 1.000 registros.')

