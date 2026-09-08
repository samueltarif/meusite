import { readFile, writeFile, mkdir, stat } from 'node:fs/promises'
import { resolve, dirname, sep } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const publicRoot = resolve(root, 'public')
const assets = JSON.parse(await readFile(resolve(root, 'docs/campaign-assets.json'), 'utf8'))
let failed = 0

async function download(asset) {
  const destination = resolve(publicRoot, asset.file)
  if (!destination.startsWith(publicRoot + sep)) throw new Error('Asset path outside public directory')
  if ((await stat(destination).catch(() => null))?.size > 100) return
  let response = await fetch(asset.url, { signal: AbortSignal.timeout(30000) })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  if (asset.url.includes('unsplash.com/photos/')) {
    const optimized = new URL(response.url)
    if (optimized.hostname !== 'images.unsplash.com') throw new Error('Unexpected image destination')
    await response.body?.cancel()
    optimized.searchParams.set('w', '1400')
    optimized.searchParams.set('q', '85')
    optimized.searchParams.set('fm', 'jpg')
    response = await fetch(optimized, { signal: AbortSignal.timeout(30000) })
  }
  const contentType = response.headers.get('content-type') || ''
  if (!response.ok || !/image\/|application\/pdf/.test(contentType)) throw new Error(`Unexpected response: ${response.status} ${contentType}`)
  const data = Buffer.from(await response.arrayBuffer())
  if (asset.file.endsWith('.pdf') && data.subarray(0, 5).toString() !== '%PDF-') throw new Error('Invalid PDF')
  await mkdir(dirname(destination), { recursive: true })
  await writeFile(destination, data)
  console.info(`${asset.file}: ${data.length} bytes`)
}

for (let start = 0; start < assets.length; start += 4) {
  await Promise.all(assets.slice(start, start + 4).map(async asset => {
    try { await download(asset) } catch (error) { failed++; console.error(`${asset.file}: ${error.message}`) }
  }))
}
if (failed) process.exitCode = 1
