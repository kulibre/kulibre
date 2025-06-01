import { initializePaddle, Paddle } from '@paddle/paddle-js';

let paddleInstance: Paddle | undefined;

export async function initPaddle() {
  if (paddleInstance) return paddleInstance;
  
  try {
    console.log('Initializing Paddle with:', {
      environment: import.meta.env.VITE_PADDLE_ENVIRONMENT,
      token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN
    });

    paddleInstance = await initializePaddle({
      environment: import.meta.env.VITE_PADDLE_ENVIRONMENT === 'production' ? 'production' : 'sandbox',
      token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN
    });

    console.log('Paddle initialized successfully:', paddleInstance);
    return paddleInstance;
  } catch (error) {
    console.error('Failed to initialize Paddle:', error);
    throw error;
  }
}

export async function openCheckout(priceId: string) {
  try {
    console.log('Opening checkout for price:', priceId);
    const paddle = await initPaddle();
    if (!paddle) throw new Error('Paddle not initialized');

    // Check if third-party cookies are enabled
    try {
      const testCookie = 'paddlejs_cookies_check=1';
      document.cookie = testCookie;
      const cookiesEnabled = document.cookie.indexOf(testCookie) !== -1;
      if (!cookiesEnabled) {
        throw new Error('Third-party cookies are required for checkout');
      }
    } catch (cookieError) {
      throw new Error('Please enable third-party cookies to proceed with checkout');
    }

    await paddle.Checkout.open({
      items: [{
        priceId,
        quantity: 1
      }],
      settings: {
        displayMode: 'overlay', // This ensures better compatibility
        theme: 'light',
        locale: 'en',
        successUrl: window.location.origin + '/dashboard?checkout=success',
        closeOnSuccess: true,
      }
    });
  } catch (error: any) {
    console.error('Paddle checkout error:', error);
    if (error.message.includes('cookies')) {
      // Show a more user-friendly error for cookie issues
      throw new Error('Please enable third-party cookies in your browser settings to complete the checkout process. This is required for secure payment processing.');
    }
    throw error;
  }
}

export function formatPrice(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount / 100);
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
}

export interface Price {
  id: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
} 