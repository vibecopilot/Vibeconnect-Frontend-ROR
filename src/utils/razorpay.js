const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

/**
 * Loads the Razorpay checkout script once and resolves when window.Razorpay is
 * available. Safe to call multiple times.
 */
export const loadRazorpayScript = () => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay is only available in the browser"));
  }

  if (window.Razorpay) {
    return Promise.resolve(window.Razorpay);
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(
      `script[src="${RAZORPAY_SCRIPT_SRC}"]`
    );

    if (existing) {
      existing.addEventListener("load", () => resolve(window.Razorpay));
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Razorpay checkout"))
      );
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_SRC;
    script.async = true;
    script.onload = () => {
      if (window.Razorpay) {
        resolve(window.Razorpay);
      } else {
        reject(new Error("Razorpay checkout did not initialise"));
      }
    };
    script.onerror = () =>
      reject(new Error("Failed to load Razorpay checkout"));
    document.body.appendChild(script);
  });
};

/**
 * Opens Razorpay checkout.
 *
 * @param {Object} options
 * @param {string} options.key            Razorpay Key ID
 * @param {string} options.orderId        Razorpay order id from create_order
 * @param {number} options.amount         Amount in rupees (converted to paise here)
 * @param {string} [options.currency]     Defaults to INR
 * @param {string} [options.name]         Business / facility name
 * @param {string} [options.description]  Checkout description
 * @param {Object} [options.prefill]      { name, email, contact }
 * @param {Function} options.onSuccess    Called with Razorpay response
 * @param {Function} [options.onDismiss]  Called when the user closes checkout
 * @param {Object} [options.notes]        Notes attached to the payment
 */
export const openRazorpayCheckout = async (options) => {
  const Razorpay = await loadRazorpayScript();

  const razorpay = new Razorpay({
    key: options.key,
    order_id: options.orderId,
    amount: Math.round(Number(options.amount || 0) * 100),
    currency: options.currency || "INR",
    name: options.name || "Workspace Booking",
    description: options.description || "Facility booking payment",
    prefill: options.prefill || {},
    notes: options.notes || {},
    theme: { color: "#2563eb" },
    handler: (response) => {
      if (options.onSuccess) {
        options.onSuccess(response);
      }
    },
    modal: {
      ondismiss: () => {
        if (options.onDismiss) {
          options.onDismiss();
        }
      },
    },
  });

  razorpay.open();
  return razorpay;
};
