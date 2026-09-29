export default defineEventHandler(async (event) => {
  const html = await useStorage('assets:photography').getItem<string>('index.html')
  if (!html) throw createError({ statusCode: 404, statusMessage: 'Página não encontrada' })
  setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
  return html
})
