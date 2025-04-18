import mpClient from "@/app/lib/mercado-pago";
import { Payment } from "mercadopago";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get("payment_id");
  const testId = searchParams.get("external_reference");

  if (!paymentId || !testId) {
    return NextResponse.json({ error: "Payment ID or External Reference not found" }, { status: 400 });
  }

  const payment = new Payment(mpClient);
  const paymentData = await payment.get({ id: paymentId });

  if (paymentData.status === "approved" || paymentData.date_approved !== null) {
    return NextResponse.redirect(new URL(`/success`, request.url));
  }

  return NextResponse.redirect(new URL(`/`, request.url));
}