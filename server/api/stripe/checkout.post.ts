import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userId, userEmail, priceId } = body

  const stripeKey = process.env.STRIPE_SECRET_KEY || ''
  if (!stripeKey) {
    throw createError({ statusCode: 500, statusMessage: 'Stripe API key missing' })
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: '2025-01-27.acacia' as any,
  })

  const origin = getRequestHeader(event, 'origin') || 'http://localhost:3000'

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: userEmail,
      client_reference_id: userId,
      subscription_data: {
        trial_period_days: 30, // 30 Dias Grátis (1º mês grátis)
      },
      line_items: [
        {
          price_data: priceId ? undefined : {
            currency: 'brl',
            product_data: {
              name: 'Plano Pro - Link-in-Bio (30 dias grátis)',
              description: 'Primeiro mês grátis! Links ilimitados, temas exclusivos e relatório de cliques.',
            },
            unit_amount: 1990, // R$ 19,90/mês a partir do 2º mês
            recurring: {
              interval: 'month',
            },
          },
          price: priceId || undefined,
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/dashboard?checkout=cancel`,
    })

    return { url: session.url }
  } catch (error: any) {
    console.error('Stripe error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }
})
