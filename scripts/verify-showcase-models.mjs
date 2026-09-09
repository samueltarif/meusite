import assert from 'node:assert/strict'
import { createJiti } from 'jiti'
const jiti = createJiti(import.meta.url)
const { createShowcaseModel, disposeModel } = await jiti.import('../app/utils/showcaseModels.ts')
const base = { finish: '#b59168', accent: '#697460', handles: true, exploded: false, part: '' }
for (const kind of ['cabinet', 'valve', 'room']) {
  const group = createShowcaseModel({ ...base, kind })
  assert.ok(group.children.length > 5, `${kind}: model must contain multiple volumes`)
  let disposed = 0
  for (const mesh of group.children) {
    mesh.geometry.computeBoundingBox()
    assert.ok(Number.isFinite(mesh.geometry.boundingBox.max.x))
    assert.ok(mesh.material.color.isColor)
    mesh.geometry.addEventListener('dispose', () => disposed++)
  }
  disposeModel(group)
  assert.equal(disposed, group.children.length)
}
const cabinet = createShowcaseModel({ ...base, kind: 'cabinet' })
const handleless = createShowcaseModel({ ...base, kind: 'cabinet', handles: false })
assert.equal(cabinet.children.length - handleless.children.length, 3)
const valve = createShowcaseModel({ ...base, kind: 'valve', exploded: true, part: 'Conexões' })
const flanges = valve.children.filter(child => child.name === 'Conexões')
assert.ok(flanges.every(mesh => Math.abs(mesh.position.x) === 1.7))
assert.ok(flanges.every(mesh => mesh.material.emissiveIntensity === 0.45))
for (const model of [cabinet, handleless, valve]) disposeModel(model)
console.log('3D geometry, finish materials, handles, exploded parts, highlighting and disposal passed.')
