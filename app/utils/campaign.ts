export function campaignWhatsapp(subject: string = 'um site para minha empresa'): string {
  return `https://wa.me/5511951372631?text=${encodeURIComponent(`Olá! Vim pelo site da Avyro e gostaria de conversar sobre ${subject}.`)}`
}
