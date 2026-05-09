export const openRazorpay = (options) => {
  return new Promise((resolve, reject) => {
    const key = process.env.REACT_APP_RAZORPAY_KEY_ID;

    if (!key) {
      reject(new Error('Razorpay key not found. Add REACT_APP_RAZORPAY_KEY_ID to frontend/.env'));
      return;
    }

    if (!window.Razorpay) {
      reject(new Error('Razorpay SDK not loaded'));
      return;
    }

    const rzp = new window.Razorpay({ ...options, key });

    rzp.on('payment.failed', (response) => {
      reject(new Error(response.error.description));
    });

    rzp.open();
    resolve(rzp);
  });
};
