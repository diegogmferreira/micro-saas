import mpClient from "@/app/lib/mercado-pago";
import { Preference } from "mercadopago";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { testId, userEmail } = await request.json();

  try {
    const preference = new Preference(mpClient);

    const createdPreference = await preference.create({
      body: {
        external_reference: testId,
        metadata: {
          testId,
          userEmail,
        },
        ...(userEmail && { payer: { email: userEmail } }),
        items: [
          {
            id: "",
            description: "",
            title: "",
            quantity: 1,
            unit_price: 1,
            currency_id: "BRL",
            category_id: "services"
          }
        ],
        payment_methods: {
          installments: 12,
          // excluded_payment_methods: [
          //   { id: "bolbradesco" },
          //   { id: "pec" },
          // ],
          // excluded_payment_types: []
        },
        auto_return: "approved",
        back_urls: {
          success: `${request.headers.get('origin')}/api/mercado-page/pending`,
          failure: `${request.headers.get('origin')}/api/mercado-page/pending`,
          pending: `${request.headers.get('origin')}/api/mercado-page/pending`,
        }
      },
    })

    console.log(createdPreference.id)

    if (!createdPreference.id) {
      return NextResponse.json({ error: "Mercado Pago Error" }, { status: 500 });
    }

    return NextResponse.json({
      preferenceId: createdPreference.id,
      initPoint: createdPreference.init_point,
    })

  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Mercado Pago Error" }, { status: 500 });
  }

}