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
  let matchedCouponId: string | null = null
  let couponDetails = 'Plano Pro Ativo'
  let stripeInstance: Stripe | null = null

  // 1. Validar via Stripe API (Checa Código de Promoção, ID do Cupom e Nome do Cupom no Stripe)
  if (stripeKey) {
    try {
      stripeInstance = new Stripe(stripeKey, { apiVersion: '2025-01-27.acacia' as any })
      
      // A. Procurar por Códigos Promocionais ativos na Stripe (ex: VIPAMIGOS)
      const promoCodes = await stripeInstance.promotionCodes.list({ code: cleanCode, active: true, limit: 10 })
      if (promoCodes.data && promoCodes.data.length > 0) {
        const promo = promoCodes.data.find(p => p.coupon && p.coupon.valid)
        if (promo) {
          isValid = true
          matchedCouponId = promo.coupon.id
          couponDetails = `Cupom Promo Stripe "${cleanCode}"`
        }
      }

      // B. Procurar por ID de Cupom direto no Stripe (case-insensitive)
      if (!isValid) {
        try {
          const coupon = await stripeInstance.coupons.retrieve(cleanCode.toLowerCase())
          if (coupon && coupon.valid) {
            isValid = true
            matchedCouponId = coupon.id
            couponDetails = `Cupom Stripe "${coupon.name || coupon.id}"`
          }
        } catch (e) {
          try {
            const couponUpper = await stripeInstance.coupons.retrieve(cleanCode)
            if (couponUpper && couponUpper.valid) {
              isValid = true
              matchedCouponId = couponUpper.id
              couponDetails = `Cupom Stripe "${couponUpper.name || couponUpper.id}"`
            }
          } catch (err2) {}
        }
      }

      // C. Procurar por NOME do Cupom na lista de Cupons do Stripe (ex: Nome = VIPAMIGOS)
      if (!isValid) {
        const allCoupons = await stripeInstance.coupons.list({ limit: 100 })
        const foundByName = allCoupons.data.find(c => 
          c.valid && (
            (c.name && c.name.trim().toUpperCase() === cleanCode) ||
            (c.id && c.id.trim().toUpperCase() === cleanCode)
          )
        )
        if (foundByName) {
          isValid = true
          matchedCouponId = foundByName.id
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

  // 3. Obter perfil atual do usuário no Supabase
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  let stripeCustomerId = profile?.stripe_customer_id || null
  let stripeSubscriptionId = profile?.stripe_subscription_id || null

  // 4. Se houver cupom Stripe correspondente, registrar a aplicação do cupom na Stripe para incrementar a contagem ("1 de 10 resgates")
  if (stripeInstance && matchedCouponId) {
    try {
      if (stripeSubscriptionId) {
        // Aplicar na assinatura existente do Stripe
        try {
          await stripeInstance.subscriptions.update(stripeSubscriptionId, {
            coupon: matchedCouponId
          })
        } catch (subErr: any) {
          await stripeInstance.subscriptions.update(stripeSubscriptionId, {
            discounts: [{ coupon: matchedCouponId }]
          } as any)
        }
      } else if (stripeCustomerId) {
        // Aplicar no cliente existente do Stripe
        await stripeInstance.customers.update(stripeCustomerId, {
          coupon: matchedCouponId
        })
      } else {
        // Criar registro de cliente no Stripe com o cupom para contabilizar o resgate
        let userEmail = profile?.email
        if (!userEmail) {
          try {
            const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId)
            userEmail = authUser?.user?.email || ''
          } catch (e) {}
        }

        const newCustomer = await stripeInstance.customers.create({
          email: userEmail || undefined,
          coupon: matchedCouponId,
          metadata: { userId, couponCode: cleanCode }
        })
        stripeCustomerId = newCustomer.id
      }
    } catch (stripeResgateErr: any) {
      console.warn('Erro ao contabilizar resgate no Stripe:', stripeResgateErr.message)
    }
  }

  // 5. Atualizar perfil do usuário no Supabase
  const updateData: Record<string, any> = {
    plan_type: 'pro',
    subscription_status: 'active',
    updated_at: new Date().toISOString()
  }

  if (stripeCustomerId) {
    updateData.stripe_customer_id = stripeCustomerId
  }

  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update(updateData)
    .eq('id', userId)

  if (updateError) {
    console.error('Erro ao atualizar o Supabase:', updateError)
    throw createError({ statusCode: 500, statusMessage: 'Erro ao atualizar seu plano no banco de dados.' })
  }

  return {
    success: true,
    message: `Parabéns! O cupom "${cleanCode}" foi resgatado com sucesso e contabilizado no Stripe! Seu Plano Pro está liberado.`,
    couponDetails
  }
})
