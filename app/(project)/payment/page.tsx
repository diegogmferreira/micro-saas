"use client"

import useMercadoPago from "@/app/hooks/use-mercado-pago";
import { useStripe } from "@/app/hooks/use-stripe";

export default function Payments() {
  const { createPaymentStripeCheckout, createSubscriptionStripeCheckout, handleCreateStripePortal } = useStripe();
  const { createMercadoPagoCheckout } = useMercadoPago();

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-10">
      <h1 className="text-4xl font-bold">Payments</h1>
      <button
        className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => createPaymentStripeCheckout({ testId: "123" })}
      >
        Criar Pagamento Stripe
      </button>

      <button
        className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => createSubscriptionStripeCheckout({ testId: "123" })}
      >
        Criar Assinatura Stripe
      </button>

      <button
        className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleCreateStripePortal}
      >
        Criar Portal Stripe
      </button>

      <button
        className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => createMercadoPagoCheckout({
          testeId: "123",
          userEmail: "john@doe.com",
        })}
      >
        Criar Pagamento Mercado Pago
      </button>
    </div>
  )
}