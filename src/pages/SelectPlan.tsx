import { SubscriptionPlans } from '@/components/subscription/SubscriptionPlans';

export default function SelectPlan() {
  return (
    <div className="min-h-screen bg-creatively-gray/50 flex flex-col">
      <header className="py-6 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2">
            <div className="bg-creatively-purple rounded-lg w-8 h-8 flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>
            <h1 className="text-xl font-bold">Kulibre</h1>
          </div>
        </div>
      </header>
      
      <div className="flex-1">
        <SubscriptionPlans />
      </div>
    </div>
  );
}
