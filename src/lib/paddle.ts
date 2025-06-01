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

    await paddle.Checkout.open({
      items: [{
        priceId,
        quantity: 1
      }]
    });
  } catch (error) {
    console.error('Paddle checkout error:', error);
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