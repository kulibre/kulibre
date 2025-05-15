
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { 
  Check, 
  X, 
  DollarSign,
  ArrowRight
} from 'lucide-react';

export default function SelectPlan() {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'basic' | 'premium'>('free');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: subscriptionData, error } = await supabase
        .from('subscriptions')
        .select('tier')
        .eq('user_id', user.id)
        .single();

      if (subscriptionData?.tier !== 'free') {
        navigate('/dashboard');
      }
    };

    checkUserSubscription();
  }, [navigate]);

  const handlePlanSelection = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('subscriptions')
        .update({ tier: selectedPlan })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success(`Welcome to the ${selectedPlan} plan!`);
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Plan selection failed');
    } finally {
      setIsLoading(false);
    }
  };

  const PlanCard = ({ 
    title, 
    price, 
    description,
    features, 
    unavailable = [],
    value,
    popular = false
  }: { 
    title: string, 
    price: string, 
    description: string,
    features: string[], 
    unavailable?: string[],
    value: 'free' | 'basic' | 'premium',
    popular?: boolean
  }) => (
    <Card 
      className={`w-full cursor-pointer transition-all duration-200 ${
        selectedPlan === value 
          ? 'border-2 border-creatively-purple ring-2 ring-creatively-purple/20' 
          : 'border-gray-200 hover:border-creatively-purple/50'
      } ${popular ? 'relative' : ''}`}
      onClick={() => setSelectedPlan(value)}
    >
      {popular && (
        <div className="absolute top-0 right-0 bg-creatively-purple text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
          Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {title}
          <DollarSign className="h-5 w-5 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-3xl font-bold">{price}</div>
        <p className="text-sm text-muted-foreground">{description}</p>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
          {unavailable.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              <X className="h-4 w-4 text-red-500 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <div className="pt-4">
          <div className={`w-5 h-5 rounded-full border-2 ${
            selectedPlan === value 
              ? 'border-creatively-purple bg-creatively-purple/20' 
              : 'border-gray-300'
          } flex items-center justify-center`}>
            {selectedPlan === value && (
              <div className="w-2 h-2 rounded-full bg-creatively-purple"></div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-creatively-gray/50 flex flex-col">
      <header className="py-6 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2">
            <div className="bg-creatively-purple rounded-lg w-8 h-8 flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <h1 className="text-xl font-bold">Creatively</h1>
          </div>
        </div>
      </header>
      
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h1>
            <p className="text-xl text-muted-foreground">
              Select the plan that works best for your creative workflow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <PlanCard 
              title="Free" 
              price="$0" 
              value="free"
              description="Perfect for individuals and small projects"
              features={[
                "Up to 5 Projects",
                "Basic Task Management",
                "Collaborative Workspace"
              ]}
              unavailable={[
                "Advanced Analytics", 
                "Priority Support",
                "Unlimited Projects"
              ]} 
            />
            <PlanCard 
              title="Basic" 
              price="$9.99/mo" 
              value="basic"
              description="Great for growing creative teams"
              features={[
                "Up to 20 Projects",
                "Advanced Task Management",
                "Team Collaboration",
                "Basic Analytics",
                "Client Portal"
              ]}
              unavailable={[
                "Enterprise Features",
                "Priority Support"
              ]} 
              popular={true}
            />
            <PlanCard 
              title="Premium" 
              price="$24.99/mo" 
              value="premium"
              description="For professional agencies and studios"
              features={[
                "Unlimited Projects",
                "Advanced Analytics",
                "Priority Support",
                "Custom Integrations",
                "Advanced Team Management"
              ]} 
            />
          </div>
          
          <div className="text-center">
            <Button 
              className="px-8 py-6 text-lg h-auto"
              onClick={handlePlanSelection}
              disabled={isLoading}
            >
              {isLoading ? (
                "Processing..."
              ) : (
                <>
                  Continue with {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
            
            <p className="mt-4 text-sm text-muted-foreground">
              You can change your plan at any time in settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
