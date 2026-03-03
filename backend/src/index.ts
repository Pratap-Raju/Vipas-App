import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { config } from 'dotenv';

config();

const app = new Hono();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia' as any,
});

app.use(
  '*',
  cors({
    credentials: true,
    origin: (origin) => origin || '*',
  })
);

app.get('/', (c) => {
  return c.text('Vipas Backend API');
});

// Create/Setup Profile for onboarding
app.post('/api/profile/setup', async (c) => {
  const { userId, email, fullName } = await c.req.json();
  
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 14);

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      email,
      full_name: fullName,
      trial_started_at: new Date().toISOString(),
      trial_ends_at: trialEndsAt.toISOString().split('T')[0],
      current_streak_days: 0,
      longest_streak_days: 0,
      is_eligible_for_discount: false,
      is_on_discount: false
    })
    .select()
    .single();

  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

// Update streak logic
app.post('/api/streak/update', async (c) => {
  const { userId, metGoal, totalSeconds } = await c.req.json();

  if (!userId) return c.json({ error: 'User ID required' }, 400);

  const today = new Date().toISOString().split('T')[0];

  // Record daily usage/streak entry
  const { error: usageError } = await supabase
    .from('daily_streaks')
    .upsert({
      user_id: userId,
      date: today,
      met_goal: metGoal,
      total_screen_time_seconds: totalSeconds
    });

  if (usageError) return c.json({ error: usageError.message }, 500);

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!profile) return c.json({ error: 'Profile not found' }, 404);

  let newStreak = profile.current_streak_days || 0;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (metGoal) {
    if (profile.last_streak_date === yesterdayStr) {
      newStreak += 1;
    } else if (profile.last_streak_date === today) {
       // Already updated today? Keep current count but update status
    } else {
      newStreak = 1;
    }
  } else {
    newStreak = 0;
  }

  const isEligible = newStreak >= 14;
  
  const { data: updatedProfile, error: updateError } = await supabase
    .from('profiles')
    .update({
      current_streak_days: newStreak,
      longest_streak_days: Math.max(newStreak, profile.longest_streak_days || 0),
      last_streak_date: today,
      is_eligible_for_discount: isEligible || (profile.is_eligible_for_discount || false)
    })
    .eq('id', userId)
    .select()
    .single();

  if (updateError) return c.json({ error: updateError.message }, 500);

  return c.json({ 
    currentStreak: newStreak, 
    isEligible: updatedProfile.is_eligible_for_discount 
  });
});

// Stripe Webhook
app.post('/api/webhook', async (c) => {
  const sig = c.req.header('stripe-signature');
  const body = await c.req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return c.json({ error: `Webhook Error: ${err.message}` }, 400);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    if (userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_eligible_for_discount')
        .eq('id', userId)
        .single();

      await supabase
        .from('profiles')
        .update({
          is_on_discount: profile?.is_eligible_for_discount || false,
          stripe_subscription_id: session.subscription as string,
          stripe_customer_id: session.customer as string
        })
        .eq('id', userId);
    }
  }

  return c.json({ received: true });
});

// Get Profile/Status
app.get('/api/status/:userId', async (c) => {
  const userId = c.req.param('userId');
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!profile) return c.json({ error: 'Profile not found' }, 404);

  return c.json(profile);
});

// Stripe Checkout Session
app.post('/api/checkout/create-session', async (c) => {
  const { userId, email } = await c.req.json();
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!profile) return c.json({ error: 'Profile not found' }, 404);

  const originalPrice = 999; // $9.99 in cents
  const discountedPrice = 250; // $2.50 in cents (75% off)

  const amount = profile.is_eligible_for_discount ? discountedPrice : originalPrice;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Vipas Premium Plan',
            description: profile.is_eligible_for_discount 
              ? 'Streak Discount Applied (75% off!)' 
              : 'Monthly Plan (Keep a 14-day streak to unlock 75% off!)',
          },
          unit_amount: amount,
          recurring: { interval: 'month' },
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    customer_email: email,
    metadata: { userId },
  });

  return c.json({ url: session.url });
});

// Recommendations API
app.get('/api/recommendations', async (c) => {
  const { data, error } = await supabase
    .from('recommendations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

export default {
  fetch: app.fetch,
  port: 3002,
};
