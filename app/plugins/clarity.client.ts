export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  const w = window as any
  if (w.clarity) return

  const config = useRuntimeConfig().public
  const clarityId = (config.microsoftClarityId as string) || 'z0y9ky79tm'

  ;(function(c: any, l: Document, a: string, r: string, i: string) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) }
    const t = l.createElement(r) as HTMLScriptElement
    t.async = true
    t.src = 'https://www.clarity.ms/tag/' + i
    const y = l.getElementsByTagName(r)[0]
    y?.parentNode?.insertBefore(t, y)
  })(w, document, 'clarity', 'script', clarityId)
})
