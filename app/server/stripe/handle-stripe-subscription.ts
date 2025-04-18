import { db } from "@/app/lib/firebase";
import "server-only";

import type Stripe from "stripe";

export async function handleStripeSubscription(event: Stripe.CheckoutSessionCompletedEvent) {
  if (event.data.object.payment_status === "paid") {
    console.log("Send email to customer that subscription payment has succeeded and give them access");

    const userId = event.data.object.metadata?.userId;

    if (!userId) {
      console.log("User ID not found");
      return;
    }

    await db.collection("users").doc(userId).update({
      stripeCustomerId: event.data.object.id,
      stripeSubscriptionId: event.data.object.subscription,
      stripeSubscriptionStatus: "active",
    });
  }
}