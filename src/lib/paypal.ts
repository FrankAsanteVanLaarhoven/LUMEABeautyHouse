/** PayPal payments for LUMÉA consumer checkout */

export function paypalBusinessEmail() {
  return (
    process.env.PAYPAL_BUSINESS_EMAIL ||
    process.env.NEXT_PUBLIC_PAYPAL_BUSINESS_EMAIL ||
    "frankleroyvan@gmail.com"
  );
}

export function isPaypalEnabled() {
  return Boolean(paypalBusinessEmail());
}

/**
 * Classic PayPal Website Payments Standard (_xclick).
 * No client SDK required — redirects buyer to PayPal with our merchant email.
 */
export function buildPaypalRedirectUrl(input: {
  amount: number;
  itemName: string;
  invoice: string;
  returnUrl: string;
  cancelUrl: string;
  custom?: string;
  currency?: string;
}) {
  const params = new URLSearchParams({
    cmd: "_xclick",
    business: paypalBusinessEmail(),
    item_name: input.itemName.slice(0, 120),
    amount: Math.max(0.01, input.amount).toFixed(2),
    currency_code: input.currency || "USD",
    invoice: input.invoice.slice(0, 127),
    return: input.returnUrl,
    cancel_return: input.cancelUrl,
    // Collect shipping on PayPal if needed; we already have address in order
    no_shipping: "1",
    no_note: "0",
    rm: "1", // GET return with variables
    bn: "LUMEA_BeautyHouse_EC",
  });
  if (input.custom) params.set("custom", input.custom.slice(0, 256));
  return `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`;
}

/** Sandbox redirect when PAYPAL_MODE=sandbox */
export function paypalCheckoutHost() {
  return process.env.PAYPAL_MODE === "sandbox"
    ? "https://www.sandbox.paypal.com/cgi-bin/webscr"
    : "https://www.paypal.com/cgi-bin/webscr";
}

export function buildPaypalRedirectUrlWithHost(
  input: Parameters<typeof buildPaypalRedirectUrl>[0]
) {
  const url = buildPaypalRedirectUrl(input);
  if (process.env.PAYPAL_MODE === "sandbox") {
    return url.replace(
      "https://www.paypal.com/cgi-bin/webscr",
      paypalCheckoutHost()
    );
  }
  return url;
}
