import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const stripeKey = process.env.STRIPE_SECRET_KEY || ''
  const supabaseUrl = process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  if (!stripeKey || !supabaseServiceKey) {
    return { status: 'configuration_error' }
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: '2025-01-27.acacia' as any,
  })

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
  const body = await readRawBody(event)
  const signature = getRequestHeader(event, 'stripe-signature')

  let stripeEvent: Stripe.Event

  try {
    if (signature && process.env.STRIPE_WEBHOOK_SECRET) {
      stripeEvent = stripe.webhooks.constructEvent(
        body || '',
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } else {
      stripeEvent = JSON.parse(body || '{}')
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    throw createError({ statusCode: 400, statusMessage: `Webhook Error: ${err.message}` })
  }

  // Handle Event
  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const session = stripeEvent.data.object as Stripe.Checkout.Session
      const userId = session.client_reference_id
      const customerId = session.customer as string
      const subscriptionId = session.subscription as string

      if (userId) {
        await supabaseAdmin
          .from('profiles')
          .update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_status: 'active',
            plan_type: 'pro',
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId)
      }
      break
    }
    case 'customer.subscription.deleted': {
      const subscription = stripeEvent.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      await supabaseAdmin
        .from('profiles')
        .update({
          subscription_status: 'canceled',
          plan_type: 'free',
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_customer_id', customerId)
      break
    }
  }

  return { received: true }
})
