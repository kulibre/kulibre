import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { initPaddle, openCheckout, formatPrice, type SubscriptionPlan } from '@/lib/paddle';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

// Subscription plans with actual Paddle IDs
const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'pri_01jwnghvbx7wfmcj68p9x80t97', // Basic plan ID
    name: 'Basic Plan',
    description: 'Perfect for individuals and small teams',
    price: 900, // $9.00
    currency: 'USD',
    interval: 'month',
    features: [
      'Basic features',
      'Email support',
      'Up to 5 users'
    ]
  },
  {
    id: 'pri_01jwngk6r77jrkx90eqbpz4y2n', // Pro plan ID
    name: 'Pro Plan',
    description: 'For growing teams with advanced needs',
    price: 2900, // $29.00
    currency: 'USD',
    interval: 'month',
    features: [
      'All Basic features',
      'Priority support',
      'Unlimited users',
      'Advanced analytics'
    ]
  }
];

export function SubscriptionPlans() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Initialize Paddle when component mounts
    const initializePaddle = async () => {
      try {
        const paddle = await initPaddle();
        console.log('Paddle initialized successfully:', paddle); // Debug log
      } catch (error) {
        console.error('Failed to initialize Paddle:', error);
        toast({
          title: "Error",
          description: "Failed to initialize payment system",
          variant: "destructive"
        });
      }
    };

    initializePaddle();
  }, [toast]);

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    try {
      console.log('handleSubscribe called with plan:', plan); // Debug log
      console.log('Current user state:', user); // Debug log
      console.log('Current location:', location.pathname); // Debug log

      // Check if user is authenticated
      if (!user) {
        console.log('User not authenticated, storing plan and redirecting'); // Debug log
        sessionStorage.setItem('selectedPlan', plan.id);
        // Store the current location to return after login
        sessionStorage.setItem('returnTo', location.pathname);
        navigate('/login');
        return;
      }

      setIsLoading(true);
      console.log('Opening checkout for plan:', plan.id); // Debug log
      await openCheckout(plan.id);
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Debug render log
  console.log('Rendering SubscriptionPlans, user state:', user);
  console.log('Current location:', location.pathname);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        {!user && (
          <p className="text-gray-600">
            Sign in to subscribe to a plan
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-3xl font-bold mb-4">
                {formatPrice(plan.price, plan.currency)}
                <span className="text-sm font-normal">/month</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleSubscribe(plan)}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : `Go ${plan.name.split(' ')[0]}`}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 