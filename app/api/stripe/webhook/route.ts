import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!env.stripeSecretKey || !env.stripeWebhookSecret || !signature) {
    return NextResponse.json({ received: true, mode: "demo" });
  }

  const stripe = new Stripe(env.stripeSecretKey);
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, env.stripeWebhookSecret);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid Stripe webhook" },
      { status: 400 }
    );
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const supabase = createSupabaseAdminClient();

    if (supabase) {
      await supabase.from("subscriptions").upsert({
        stripe_subscription_id: subscription.id,
        stripe_customer_id:
          typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id,
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  }

  return NextResponse.json({ received: true });
}
