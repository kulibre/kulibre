import { Calendar, FolderKanban, Home, Menu, Settings, X, CheckSquare, Users, BarChart2, File, ArrowUpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionInfo {
  price_id: string;
  status: string;
  cancel_at_period_end: boolean;
}

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('subscriptions')
          .select('price_id, status, cancel_at_period_end')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching subscription:', error);
          return;
        }

        setSubscription(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchSubscription();
  }, []);

  const isBasicPlan = !subscription || subscription.price_id === 'pri_01jwnghvbx7wfmcj68p9x80t97';
  const isActive = subscription?.status === 'active' && !subscription?.cancel_at_period_end;
  const showUpgradeOption = isBasicPlan && isActive;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="md:hidden p-2">
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="bg-kulibre-purple rounded-lg w-8 h-8 flex items-center justify-center">
                <span className="text-white font-bold">K</span>
              </div>
              <h1 className="text-xl font-bold">kulibre</h1>
            </div>
            <button onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-auto p-4 space-y-1">
            <MobileNavItem
              icon={<Home className="w-5 h-5" />}
              href="/dashboard"
              label="Dashboard"
              onClick={() => setOpen(false)}
            />
            <MobileNavItem
              icon={<FolderKanban className="w-5 h-5" />}
              href="/projects"
              label="Projects"
              onClick={() => setOpen(false)}
            />
            <MobileNavItem
              icon={<CheckSquare className="w-5 h-5" />}
              href="/tasks"
              label="Tasks"
              onClick={() => setOpen(false)}
            />
            <MobileNavItem
              icon={<Users className="w-5 h-5" />}
              href="/team"
              label="Team"
              onClick={() => setOpen(false)}
            />
            <MobileNavItem
              icon={<Calendar className="w-5 h-5" />}
              href="/calendar"
              label="Calendar"
              onClick={() => setOpen(false)}
            />
            <MobileNavItem
              icon={<BarChart2 className="w-5 h-5" />}
              href="/analytics"
              label="Analytics"
              onClick={() => setOpen(false)}
            />
            <MobileNavItem
              icon={<File className="w-5 h-5" />}
              href="/files"
              label="Files"
              onClick={() => setOpen(false)}
            />
            <MobileNavItem
              icon={<Settings className="w-5 h-5" />}
              href="/settings"
              label="Settings"
              onClick={() => setOpen(false)}
            />

            {showUpgradeOption && (
              <div className="pt-4 mt-4 border-t">
                <Link
                  to="/pricing"
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <ArrowUpCircle className="w-5 h-5" />
                  Upgrade to Pro
                  <div className="ml-auto text-xs bg-white/20 px-1.5 py-0.5 rounded">
                    New
                  </div>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface MobileNavItemProps {
  icon: React.ReactNode;
  href: string;
  label: string;
  active?: boolean;
  onClick: () => void;
}

function MobileNavItem({ icon, href, label, active, onClick }: MobileNavItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        active
          ? "bg-kulibre-purple text-white"
          : "text-muted-foreground hover:bg-kulibre-purple/10 hover:text-foreground"
      )}
      onClick={onClick}
    >
      {icon}
      {label}
    </Link>
  );
}
