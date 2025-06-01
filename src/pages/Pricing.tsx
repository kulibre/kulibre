import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your needs. All plans include our core features with different usage limits.
          </p>
        </div>
        <SubscriptionPlans />
      </div>
    </div>
  );
} 