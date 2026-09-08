import { computed, ref } from 'vue'

export function useDemoChoice<T>(choices: readonly T[]) {
  const index = ref<number>(0)
  const current = computed<T>(() => choices[index.value] ?? choices[0]!)
  const choose = (value: number): void => { if (Number.isInteger(value) && value >= 0 && value < choices.length) index.value = value }
  return { index, current, choose }
}
