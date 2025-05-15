
import { Calendar, FolderKanban, Home, Menu, Settings, X, CheckSquare, Users } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);

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
              icon={<Settings className="w-5 h-5" />}
              href="/settings"
              label="Settings"
              onClick={() => setOpen(false)}
            />
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
