import { db } from "@/app/lib/firebase";
import resend from "@/app/lib/resend";
import "server-only";

import type Stripe from "stripe";

export async function handleStripeSubscription(event: Stripe.CheckoutSessionCompletedEvent) {
  if (event.data.object.payment_status === "paid") {
    console.log("Send email to customer that subscription payment has succeeded and give them access");

    const userId = event.data.object.metadata?.userId;
    const userEmail = event.data.object.customer_email || event.data.object.customer_details?.email;

    if (!userId || !userEmail) {
      console.log("User ID not found");
      return;
    }

    await db.collection("users").doc(userId).update({
      stripeCustomerId: event.data.object.id,
      stripeSubscriptionId: event.data.object.subscription,
      stripeSubscriptionStatus: "active",
    });

    const { data, error } = await resend.emails.send({
      from: 'Acme <me@example.com>',
      to: [userEmail],
      subject: 'Assinatura ativada com sucesso',
      text: 'Assinatura ativada com sucesso'
    })

    if (error) {
      console.error(error);
    }

    console.log(data)
  }
}