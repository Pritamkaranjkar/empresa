export default defineNuxtPlugin(() => {
  if (process.client) {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.head.appendChild(script);
  }
});
