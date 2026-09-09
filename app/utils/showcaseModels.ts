import * as T from 'three'
import type { ModelOptions } from '~/types/showcase'

export function createShowcaseModel(options: ModelOptions): T.Group {
  const group = new T.Group()
  function mesh(geometry: T.BufferGeometry, color: string, x: number, y: number, z: number, name = '') {
    const material = new T.MeshStandardMaterial({ color, roughness: options.kind === 'valve' ? 0.32 : 0.7, metalness: options.kind === 'valve' ? 0.65 : 0.08 })
    if (name && options.part === name) { material.emissive.set('#127b91'); material.emissiveIntensity = 0.45 }
    const object = new T.Mesh(geometry, material)
    object.position.set(x, y, z); object.name = name; group.add(object)
    return object
  }
  const box = (w: number, h: number, d: number, c: string, x: number, y: number, z: number) => mesh(new T.BoxGeometry(w, h, d), c, x, y, z)
  if (options.kind === 'cabinet') {
    box(3.5, 0.14, 1.3, options.finish, 0, -0.75, 0)
    box(3.5, 0.14, 1.3, options.finish, 0, 0.8, 0)
    box(0.12, 1.55, 1.3, options.finish, -1.7, 0, 0)
    box(0.12, 1.55, 1.3, options.finish, 1.7, 0, 0)
    box(3.4, 1.5, 0.08, options.finish, 0, 0, -0.6)
    for (const x of [-1.12, 0, 1.12]) {
      box(1.07, 1.38, 0.09, options.accent, x, 0, options.exploded ? 1.1 : 0.65)
      if (options.handles) box(0.35, 0.035, 0.06, '#b69c68', x, 0.48, options.exploded ? 1.18 : 0.73)
    }
    for (const x of [-1.45, 1.45]) for (const z of [-0.4, 0.4]) box(0.1, 0.4, 0.1, '#37332d', x, -1, z)
    box(0.8, 0.06, 0.5, '#d4c5a9', -0.8, 0.91, 0)
  } else if (options.kind === 'valve') {
    const body = mesh(new T.CylinderGeometry(0.62, 0.62, 1.8, 40), '#9cabb1', 0, -0.25, 0, 'Corpo'); body.rotation.z = Math.PI / 2
    for (const side of [-1, 1]) {
      const x = side * (options.exploded ? 1.7 : 1.02)
      const flange = mesh(new T.CylinderGeometry(0.82, 0.82, 0.22, 40), '#c2cbd0', x, -0.25, 0, 'Conexões'); flange.rotation.z = Math.PI / 2
      for (let n = 0; n < 8; n++) {
        const angle = n * Math.PI / 4
        const bolt = mesh(new T.CylinderGeometry(0.075, 0.075, 0.3, 6), '#59666c', x, -0.25 + Math.sin(angle) * 0.66, Math.cos(angle) * 0.66, 'Conexões'); bolt.rotation.z = Math.PI / 2
      }
    }
    mesh(new T.CylinderGeometry(0.24, 0.4, 0.45, 32), '#9cabb1', 0, 0.52, 0, 'Haste')
    mesh(new T.CylinderGeometry(0.1, 0.1, 0.65, 20), '#d1d7d8', 0, options.exploded ? 1.25 : 0.98, 0, 'Haste')
    const y = options.exploded ? 1.9 : 1.4
    const wheel = mesh(new T.TorusGeometry(0.68, 0.075, 12, 48), '#156779', 0, y, 0, 'Volante'); wheel.rotation.x = Math.PI / 2
    for (let n = 0; n < 3; n++) { const spoke = mesh(new T.BoxGeometry(1.3, 0.07, 0.07), '#156779', 0, y, 0, 'Volante'); spoke.rotation.y = n * Math.PI / 3 }
  } else {
    box(4, 0.12, 3, '#b7a184', 0, -0.8, 0)
    box(4, 1.9, 0.1, '#e3dfd3', 0, 0.1, -1.45)
    box(0.1, 1.9, 3, '#d0cbbb', -1.95, 0.1, 0)
    box(1.65, 0.4, 0.7, options.accent, -0.75, -0.45, -0.85)
    box(1.65, 0.5, 0.13, options.accent, -0.75, -0.1, -1.12)
    box(0.85, 0.1, 0.65, options.finish, -0.65, -0.35, 0.25)
    box(0.12, 0.4, 0.12, '#463e34', -0.65, -0.6, 0.25)
    box(1, 0.65, 0.5, options.finish, 1.1, -0.4, -1.1)
    box(0.7, 0.9, 0.03, '#68786b', 0.4, 0.4, -1.37)
  }
  return group
}

export function disposeModel(group: T.Object3D) {
  group.traverse(object => {
    if (object instanceof T.Mesh) {
      object.geometry.dispose()
      const materials = Array.isArray(object.material) ? object.material : [object.material]
      materials.forEach(material => material.dispose())
    }
  })
}
