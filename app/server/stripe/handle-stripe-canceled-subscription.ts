import { db } from "@/app/lib/firebase";
import resend from "@/app/lib/resend";
import "server-only";

import type Stripe from "stripe";

export async function handleStripeCanceledSubscription(event: Stripe.CustomerSubscriptionDeletedEvent) {
	if (event.data.object.cancel_at_period_end) {
		const customerId = event.data.object.customer;
		const userRef = await db.collection("users").where("stripeCustomerId", "==", customerId).get();

		if (userRef.empty) {
			console.log("User not found");
			return;
		}

		const userId = userRef.docs[0].id;
		const userEmail = userRef.docs[0].data().email;

		await db.collection("users").doc(userId).update({
			stripeSubscriptionStatus: "inactive",
		});
		console.log("Send email to customer that subscription has been canceled");

		const { data, error } = await resend.emails.send({
			from: 'Acme <me@example.com>',
			to: [userEmail],
			subject: 'Assinatura cancelada com sucesso',
			text: 'Assinatura cancelada com sucesso'
		})
	
	
		if (error) {
			console.error(error);
		}
	
		console.log(data)
	}
}