import { db } from "@/app/lib/firebase";
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

		await db.collection("users").doc(userId).update({
			stripeSubscriptionStatus: "inactive",
		});
		console.log("Send email to customer that subscription has been canceled");
	}
}