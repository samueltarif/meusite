import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userId, couponCode } = body

  if (!userId || !couponCode) {
    throw createError({ statusCode: 400, statusMessage: 'Código do cupom ou ID do usuário ausente.' })
  }

  const cleanCode = String(couponCode).trim().toUpperCase()
  const stripeKey = process.env.STRIPE_SECRET_KEY || ''
  const supabaseUrl = process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  if (!supabaseServiceKey) {
    throw createError({ statusCode: 500, statusMessage: 'Configuração do Supabase ausente.' })
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  let isValid = false
  let couponDetails = 'Plano Pro Ativo'

  // 1. Validar via Stripe API (Checa Código de Promoção, ID do Cupom e Nome do Cupom no Stripe)
  if (stripeKey) {
    try {
      const stripe = new Stripe(stripeKey, { apiVersion: '2025-01-27.acacia' as any })
      
      // A. Procurar por Códigos Promocionais ativos na Stripe (ex: VIPAMIGOS)
      const promoCodes = await stripe.promotionCodes.list({ code: cleanCode, active: true, limit: 10 })
      if (promoCodes.data && promoCodes.data.length > 0) {
        const promo = promoCodes.data.find(p => p.coupon && p.coupon.valid)
        if (promo) {
          isValid = true
          couponDetails = `Cupom Promo Stripe "${cleanCode}"`
        }
      }

      // B. Procurar por ID de Cupom direto no Stripe (case-insensitive)
      if (!isValid) {
        try {
          const coupon = await stripe.coupons.retrieve(cleanCode.toLowerCase())
          if (coupon && coupon.valid) {
            isValid = true
            couponDetails = `Cupom Stripe "${coupon.name || coupon.id}"`
          }
        } catch (e) {
          try {
            const couponUpper = await stripe.coupons.retrieve(cleanCode)
            if (couponUpper && couponUpper.valid) {
              isValid = true
              couponDetails = `Cupom Stripe "${couponUpper.name || couponUpper.id}"`
            }
          } catch (err2) {}
        }
      }

      // C. Procurar por NOME do Cupom na lista de Cupons do Stripe (ex: Nome = VIPAMIGOS)
      if (!isValid) {
        const allCoupons = await stripe.coupons.list({ limit: 100 })
        const foundByName = allCoupons.data.find(c => 
          c.valid && (
            (c.name && c.name.trim().toUpperCase() === cleanCode) ||
            (c.id && c.id.trim().toUpperCase() === cleanCode)
          )
        )
        if (foundByName) {
          isValid = true
          couponDetails = `Cupom Stripe "${foundByName.name || foundByName.id}"`
        }
      }
    } catch (err: any) {
      console.warn('Alerta na verificação de cupom via Stripe:', err.message)
    }
  }

  // 2. Cupons padrão adicionais do sistema (para redundância)
  const defaultSystemCoupons = ['VIPAMIGOS', '1ANOGRATIS', 'VIP1ANO', 'PRO1ANO', 'BIANCA100', 'MEUSITE100', '100OFF']
  if (!isValid && defaultSystemCoupons.includes(cleanCode)) {
    isValid = true
  }

  if (!isValid) {
    throw createError({
      statusCode: 400,
      statusMessage: `O cupom "${cleanCode}" não foi encontrado ou não está ativo no Stripe. Verifique a digitação.`
    })
  }

  // 3. Atualizar perfil do usuário no Supabase
  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({
      plan_type: 'pro',
      subscription_status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (updateError) {
    console.error('Erro ao atualizar o Supabase:', updateError)
    throw createError({ statusCode: 500, statusMessage: 'Erro ao atualizar seu plano no banco de dados.' })
  }

  return {
    success: true,
    message: `Parabéns! O cupom "${cleanCode}" foi ativado com sucesso! Seu Plano Pro está liberado.`,
    couponDetails
  }
})
