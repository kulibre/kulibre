import { Calendar, File, FolderKanban, Home, Settings, CheckSquare, Users, ArrowUpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SidebarProps {
  className?: string;
}

interface SubscriptionInfo {
  price_id: string;
  status: string;
  cancel_at_period_end: boolean;
}

export function Sidebar({ className }: SidebarProps) {
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
    <div className={cn("w-64 border-r h-screen p-4 hidden md:block", className)}>
      <div className="flex items-center gap-2 mb-8">
        <div className="bg-kulibre-purple rounded-lg w-8 h-8 flex items-center justify-center">
          <span className="text-white font-bold">K</span>
        </div>
        <h1 className="text-xl font-bold">kulibre</h1>
      </div>

      <nav className="space-y-1">
        <NavItem icon={<Home className="w-5 h-5" />} href="/dashboard" label="Dashboard" />
        <NavItem icon={<FolderKanban className="w-5 h-5" />} href="/projects" label="Projects" />
        <NavItem icon={<CheckSquare className="w-5 h-5" />} href="/tasks" label="Tasks" />
        <NavItem icon={<Users className="w-5 h-5" />} href="/team" label="Team" />
        <NavItem icon={<Calendar className="w-5 h-5" />} href="/calendar" label="Calendar" />
        <NavItem icon={<File className="w-5 h-5" />} href="/files" label="Files" />
        <NavItem icon={<Settings className="w-5 h-5" />} href="/settings" label="Settings" />
        
        {showUpgradeOption && (
          <div className="pt-4 mt-4 border-t">
            <Link
              to="/pricing"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition-colors"
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
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  href: string;
  label: string;
  active?: boolean;
}

function NavItem({ icon, href, label, active }: NavItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        active
          ? "bg-kulibre-purple text-white"
          : "text-muted-foreground hover:bg-kulibre-purple/10 hover:text-foreground"
      )}
    >
      {icon}
      {label}
    </Link>
  );
}
