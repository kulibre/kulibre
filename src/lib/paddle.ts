import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { supabase } from '@/integrations/supabase/client';

let paddleInstance: Paddle | undefined;

export async function initPaddle() {
  if (paddleInstance) return paddleInstance;
  
  try {
    const environment = import.meta.env.VITE_PADDLE_ENVIRONMENT === 'production' ? 'production' : 'sandbox';
    const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;

    console.log('Initializing Paddle with:', {
      environment,
      token: token ? `${token.substring(0, 8)}...` : 'missing',
      tokenLength: token?.length || 0
    });

    if (!token) {
      throw new Error('Paddle client token is missing. Please add VITE_PADDLE_CLIENT_TOKEN to your .env file');
    }

    // Initialize Paddle with MCP settings
    paddleInstance = await initializePaddle({
      environment,
      token,
      checkout: {
        settings: {
          displayMode: 'inline',
          theme: 'light',
          locale: 'en',
          frameTarget: '#paddle-checkout',
          allowLogout: false
        }
      }
    });

    // Test if paddleInstance has required properties
    if (!paddleInstance?.Checkout?.open) {
      throw new Error('Paddle instance is missing required methods');
    }

    console.log('Paddle initialized successfully with capabilities:', {
      hasCheckout: !!paddleInstance.Checkout,
      hasOpen: !!paddleInstance.Checkout?.open,
      environment: environment
    });

    return paddleInstance;
  } catch (error) {
    console.error('Failed to initialize Paddle:', error);
    throw error;
  }
}

export async function openCheckout(priceId: string, container: HTMLElement) {
  try {
    console.log('Opening checkout for price:', priceId);
    const paddle = await initPaddle();
    if (!paddle) throw new Error('Paddle not initialized');

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Ensure the container is ready
    if (!container || !document.body.contains(container)) {
      throw new Error('Checkout container is not in the document');
    }

    // Show the container
    container.style.display = 'flex';

    // Ensure the target element exists
    const checkoutElement = document.getElementById('paddle-checkout');
    if (!checkoutElement) {
      throw new Error('Checkout element not found');
    }

    console.log('Attempting to open checkout with config:', {
      priceId,
      hasCheckout: !!paddle.Checkout,
      hasOpen: !!paddle.Checkout?.open,
      customerEmail: user.email,
      containerReady: !!container,
      checkoutElementReady: !!checkoutElement
    });

    // Open checkout with MCP configuration
    await paddle.Checkout.open({
      items: [{
        priceId,
        quantity: 1
      }],
      settings: {
        displayMode: 'inline',
        theme: 'light',
        locale: 'en',
        successUrl: window.location.origin + '/dashboard?checkout=success',
        frameTarget: '#paddle-checkout',
        allowLogout: false
      },
      customer: {
        email: user.email
      }
    });
  } catch (error: any) {
    // Hide the container on error
    if (container) {
      container.style.display = 'none';
    }

    console.error('Paddle checkout error:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      type: typeof error
    });
    
    if (error.message.includes('cookies')) {
      throw new Error('Please enable third-party cookies in your browser settings to complete the checkout process. This is required for secure payment processing.');
    }
    
    // Check for specific error types
    if (error.message.includes('400')) {
      throw new Error('The checkout request was invalid. This might be due to an incorrect price ID or configuration.');
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
  id: string; // Product ID (pro_*)
  priceId: string; // Price ID (pri_*)
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