import stripe from "@/app/lib/stripe";
import { handleStripeCanceledSubscription } from "@/app/server/stripe/handle-stripe-canceled-subscription";
import { handleStripePurchase } from "@/app/server/stripe/handle-stripe-purchase";
import { handleStripeSubscription } from "@/app/server/stripe/handle-stripe-subscription";
import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const secret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature || !secret) {
      return NextResponse.json({ error: "Missing signature header" }, {
        status: 400,
      });
    }

    const event = stripe.webhooks.constructEvent(body, signature, secret);

    switch (event.type) {
      case "checkout.session.completed":
        const metadata = event.data.object.metadata;

        if (metadata?.price === process.env.STRIPE_PRODUCT_PRICE_ID) {
          await handleStripePurchase(event);
        }

        if (metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
          await handleStripeSubscription(event);
        }
        break;

      case "checkout.session.expired":
        console.log("Send email to customer that payment has expired");
        break;

      case "checkout.session.async_payment_succeeded":
        console.log("Send email to customer that payment has succeeded");
        break;

      case "checkout.session.async_payment_failed":
        console.log("Send email to customer that payment has failed");
        break;

      case "customer.subscription.created":
        console.log("Welcome customer to the platform");
        break;

      case "customer.subscription.deleted":
        await handleStripeCanceledSubscription(event);
        break;

        default:
          console.log("Unhandled event type");
    }

    return NextResponse.json({message: "Webhook received"}, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, }
    );
  }
}