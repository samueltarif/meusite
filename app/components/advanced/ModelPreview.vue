<script setup lang="ts">
import type { ModelKind, ModelOptions } from '~/types/showcase'
import type * as Three from 'three'
const props = withDefaults(defineProps<{ kind: ModelKind; finish?: string; accent?: string; handles?: boolean; exploded?: boolean; part?: string }>(), { finish: '#a88661', accent: '#c6baa6', handles: true, exploded: false, part: '' })
const host = ref<HTMLElement | null>(null)
const active = ref(false)
const loading = ref(false)
const error = ref('')
const angle = ref(28)
const elevation = ref(18)
const zoom = ref(7)
let renderer: Three.WebGLRenderer | undefined
let scene: Three.Scene | undefined
let camera: Three.PerspectiveCamera | undefined
let model: Three.Group | undefined
let library: typeof import('~/utils/showcaseModels') | undefined
let observer: ResizeObserver | undefined
let destroyed = false
const options = (): ModelOptions => ({ ...props })
function render() {
  if (!renderer || !scene || !camera || !host.value) return
  const width = host.value.clientWidth; const height = host.value.clientHeight
  if (!width || !height) return
  renderer.setSize(width, height, false); camera.aspect = width / height
  camera.position.set(0, 1.4, Number(zoom.value) * (camera.aspect < 1 ? 1.2 : 1)); camera.lookAt(0, 0, 0); camera.updateProjectionMatrix()
  if (model) { model.rotation.y = Number(angle.value) * Math.PI / 180; model.rotation.x = Number(elevation.value) * Math.PI / 180 }
  renderer.render(scene, camera)
}
function rebuild() {
  if (!scene || !library) return
  if (model) { scene.remove(model); library.disposeModel(model) }
  model = library.createShowcaseModel(options()); scene.add(model); render()
}
async function activate() {
  loading.value = true; error.value = ''
  try {
    const [T, models] = await Promise.all([import('three'), import('~/utils/showcaseModels')])
    if (destroyed || !host.value) return
    library = models
    renderer = new T.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block'
    renderer.domElement.setAttribute('role', 'img'); renderer.domElement.setAttribute('aria-label', 'Modelo tridimensional conceitual; use os controles abaixo para explorar')
    host.value.appendChild(renderer.domElement)
    scene = new T.Scene(); camera = new T.PerspectiveCamera(38, 1, 0.1, 100)
    scene.add(new T.HemisphereLight('#ffffff', '#7d786b', 3))
    const light = new T.DirectionalLight('#fff1d8', 4); light.position.set(3, 5, 4); scene.add(light)
    observer = new ResizeObserver(render); observer.observe(host.value)
    active.value = true; rebuild()
  } catch { error.value = 'O 3D não está disponível neste dispositivo. Você pode continuar explorando as fotos e opções da página.'; renderer?.dispose(); renderer?.domElement.remove() }
  finally { loading.value = false }
}
function reset() { angle.value = 28; elevation.value = 18; zoom.value = 7 }
watch(() => [props.finish, props.accent, props.handles, props.exploded, props.part], rebuild)
watch([angle, elevation, zoom], render)
onBeforeUnmount(() => { destroyed = true; observer?.disconnect(); if (model) library?.disposeModel(model); renderer?.dispose(); renderer?.domElement.remove() })
</script>
<template>
  <div class="overflow-hidden rounded-xl border border-black/15 bg-[#e6e3dc] text-[#30352f]">
    <div class="relative"><div ref="host" class="h-[320px] w-full sm:h-[440px]" /><div v-if="!active" class="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center"><p class="font-heading text-2xl">Explore em três dimensões.</p><p class="max-w-sm text-sm leading-6">Gire, aproxime e observe cada volume de um estudo conceitual.</p><button :disabled="loading" class="min-h-12 rounded-full bg-[#30352f] px-7 py-3 text-sm text-white disabled:opacity-50" @click="activate">{{ loading ? 'Preparando modelo…' : 'Carregar modelo 3D ↗' }}</button><p v-if="error" role="status" class="max-w-sm text-sm">{{ error }}</p></div><span v-else class="absolute left-4 top-4 text-xs uppercase tracking-widest">3D / Estudo conceitual</span></div>
    <div v-if="active" class="grid gap-4 border-t border-black/15 p-5 sm:grid-cols-3"><label class="text-xs">Rotação<input v-model.number="angle" type="range" min="-180" max="180" class="mt-3 block min-h-11 w-full accent-[#30352f]"></label><label class="text-xs">Inclinação<input v-model.number="elevation" type="range" min="-15" max="65" class="mt-3 block min-h-11 w-full accent-[#30352f]"></label><label class="text-xs">Distância<input v-model.number="zoom" type="range" min="5" max="10" step="0.1" class="mt-3 block min-h-11 w-full accent-[#30352f]"></label><button class="min-h-11 text-left text-xs underline sm:col-span-3" @click="reset">Restaurar vista</button></div>
  </div>
</template>
