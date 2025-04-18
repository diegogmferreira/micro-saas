import stripe from "@/app/lib/stripe";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { testId, userEmail } = await request.json();

  const price = process.env.STRIPE_PRODUCT_PRICE_ID;

  if (!price) {
    return NextResponse.json("Stripe Product Price not found", { status: 500 });
  }

  const metadata = {
    testId,
    price,
  }

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price, quantity: 1 }],
      payment_method_types: ["card", "boleto"],
      mode: "payment",
      success_url: `${request.headers.get("origin")}/success`,
      cancel_url: `${request.headers.get("origin")}/`,
      ...(userEmail && { customer_email: userEmail }),
      metadata
      // customer: testId,
    });

    if (!session.url) {
      return NextResponse.json("Session URL not found", { status: 500 });
    }

    return NextResponse.json({ sessionId: session.id }, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}