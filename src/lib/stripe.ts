import Stripe from "stripe";

export { Stripe };

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
    // @ts-ignore
    apiVersion: "2026-01-28.clover",
    typescript: true,
});
