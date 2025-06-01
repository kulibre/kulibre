import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionInfo {
  id: string;
  user_id: string;
  status: string;
  price_id: string;
  quantity: number;
  cancel_at_period_end: boolean;
  created: string;
  current_period_start: string;
  current_period_end: string;
  ended_at: string | null;
  cancel_at: string | null;
  canceled_at: string | null;
  trial_start: string | null;
  trial_end: string | null;
}

export function SubscriptionStatus() {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching subscription:', error);
          return;
        }

        if (data) {
          setSubscription(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
          </CardTitle>
          <CardDescription>
            <div className="h-3 w-32 bg-gray-100 animate-pulse rounded"></div>
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const isBasicPlan = !subscription || subscription.price_id === 'pri_01jwnghvbx7wfmcj68p9x80t97';
  const isActive = subscription?.status === 'active' && !subscription?.cancel_at_period_end;

  return (
    <Card className={`bg-gradient-to-br ${isBasicPlan ? 'from-purple-50 to-white' : 'from-purple-100 to-white'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isBasicPlan ? 'Basic Plan' : 'Pro Plan'}
          {isBasicPlan && isActive && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              Upgrade Available
            </span>
          )}
        </CardTitle>
        <CardDescription>
          {isBasicPlan && isActive
            ? 'Upgrade to Pro for advanced features'
            : isBasicPlan
            ? 'Basic plan features'
            : 'You are on the Pro plan'}
        </CardDescription>
      </CardHeader>
      {isBasicPlan && isActive && (
        <CardFooter>
          <Button 
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
          >
            <ArrowUpCircle className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Button>
        </CardFooter>
      )}
    </Card>
  );
} 