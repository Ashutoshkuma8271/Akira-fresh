export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const processRazorpayPayment = async ({
  orderId,
  amount,
  userName = 'Valued Customer',
  userEmail = 'customer@example.com',
  userPhone = '9999999999',
  onSuccess,
  onFailure,
}) => {
  const rzpKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
  const testModeEnabled = import.meta.env.VITE_ENABLE_TEST_PAYMENTS === 'true';

  if (!rzpKey) {
    const error = new Error('Razorpay is not configured.');
    if (testModeEnabled) return { isSimulated: true };
    onFailure?.({ reason: error.message });
    return { isRealGateway: false, error };
  }

  const scriptLoaded = await loadRazorpayScript();

  if (scriptLoaded && typeof window !== 'undefined' && window.Razorpay) {
    const options = {
      key: rzpKey,
      amount: Math.round(amount * 100), // amount in paisa
      currency: 'INR',
      name: 'A_S FOODY',
      description: `Payment for Order #${orderId}`,
      image: '/logo.png',
      handler: async function (response) {
        // Verify payment signature on backend if endpoint is reachable
        try {
          const verificationResponse = await fetch('/api/payment/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id || orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          if (!verificationResponse.ok) {
            throw new Error('Payment verification failed.');
          }
        } catch (e) {
          console.warn('Backend payment verification note:', e);
        }

        onSuccess?.({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id || orderId,
          signature: response.razorpay_signature,
          mode: 'Razorpay Verified Gateway',
        });
      },
      prefill: {
        name: userName,
        email: userEmail,
        contact: userPhone,
      },
      theme: {
        color: '#061A27',
      },
      modal: {
        ondismiss: function () {
          if (onFailure) onFailure({ reason: 'Payment modal closed by user' });
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        if (onFailure) {
          onFailure({
            code: response.error?.code,
            description: response.error?.description,
            source: response.error?.source,
            step: response.error?.step,
            reason: response.error?.reason,
          });
        }
      });
      rzp.open();
      return { isRealGateway: true };
    } catch (err) {
      console.warn('Razorpay checkout error:', err);
      onFailure?.({ reason: err.message || 'Payment could not be started.' });
      return { isRealGateway: false, error: err };
    }
  }

  const error = new Error('Razorpay checkout is unavailable.');
  if (testModeEnabled) return { isSimulated: true };
  onFailure?.({ reason: error.message });
  return { isRealGateway: false, error };
};
