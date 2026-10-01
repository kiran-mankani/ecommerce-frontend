import api from "./api";

/* Create a Stripe Checkout Session and get the redirect URL */
export const createCheckoutSessionApi = (payload) =>
  api.post("/payment/create-checkout-session", payload).then((r) => r.data);

/* Verify a session after returning from Stripe */
export const verifyCheckoutSessionApi = (sessionId) =>
  api.get(`/payment/verify-session/${sessionId}`).then((r) => r.data);