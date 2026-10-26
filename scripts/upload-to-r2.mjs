import { readdir, readFile, stat } from 'node:fs/promises'
import { resolve, relative, extname } from 'node:path'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

// 1. Carrega variáveis do .env
const root = resolve(import.meta.dirname, '..')
const envContent = await readFile(resolve(root, '.env'), 'utf8')
const env = {}
for (const line of envContent.split('\n')) {
  const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/)
  if (match) {
    let val = match[2]?.trim() || ''
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    env[match[1]] = val
  }
}

const endpoint = env.R2_ENDPOINT
const accessKeyId = env.R2_ACCESS_KEY_ID
const secretAccessKey = env.R2_SECRET_ACCESS_KEY
const bucket = env.R2_BUCKET_NAME || 'avyro-sites'
const publicUrlBase = (env.R2_PUBLIC_URL || '').replace(/\/$/, '')

if (!endpoint || !accessKeyId || !secretAccessKey) {
  console.error('Credenciais do R2 não encontradas no .env')
  process.exit(1)
}

const s3 = new S3Client({
  region: 'auto',
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
})

const MIME_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
  '.json': 'application/json',
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript'
}

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...await getFiles(fullPath))
    } else if (entry.isFile()) {
      files.push(fullPath)
    }
  }
  return files
}

const publicDir = resolve(root, 'public')
console.log('Escaneando arquivos em public/...');
const allFiles = await getFiles(publicDir)
console.log(`Total de arquivos encontrados: ${allFiles.length}`)

let uploaded = 0
let failed = 0
const errors = []

const CONCURRENCY = 6
for (let i = 0; i < allFiles.length; i += CONCURRENCY) {
  const batch = allFiles.slice(i, i + CONCURRENCY)
  await Promise.all(batch.map(async (filePath) => {
    const relPath = relative(publicDir, filePath).replace(/\\/g, '/')
    const ext = extname(filePath).toLowerCase()
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'

    try {
      const fileBuffer = await readFile(filePath)
      await s3.send(new PutObjectCommand({
        Bucket: bucket,
        Key: relPath,
        Body: fileBuffer,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000'
      }))
      uploaded++
      process.stdout.write(`\r[${uploaded}/${allFiles.length}] Enviado: ${relPath}`)
    } catch (err) {
      failed++
      errors.push({ file: relPath, error: err.message })
      console.error(`\nErro ao enviar ${relPath}:`, err.message)
    }
  }))
}

console.log(`\n\n--- RESUMO DO UPLOAD ---`)
console.log(`Sucesso: ${uploaded}`)
console.log(`Falhas: ${failed}`)

if (errors.length > 0) {
  console.log('Erros:', errors)
}

// 2. Verificação HTTP via URL pública
console.log('\n--- VERIFICANDO ACESSO PÚBLICO (HTTP GET) ---')
let verified = 0
let verifyFailed = 0
const testSample = allFiles.slice(0, 15) // Testa uma amostra inicial para checar conectividade

for (const filePath of testSample) {
  const relPath = relative(publicDir, filePath).replace(/\\/g, '/')
  const fileUrl = `${publicUrlBase}/${encodeURI(relPath)}`
  try {
    const res = await fetch(fileUrl, { method: 'HEAD' })
    if (res.ok) {
      verified++
      console.log(`OK (${res.status}): ${fileUrl} [${res.headers.get('content-type')}]`)
    } else {
      verifyFailed++
      console.warn(`FALHA (${res.status}): ${fileUrl}`)
    }
  } catch (e) {
    verifyFailed++
    console.error(`ERRO: ${fileUrl} - ${e.message}`)
  }
}

console.log(`\nAmostra verificada: ${verified} OK, ${verifyFailed} falhas`)
