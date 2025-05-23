import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Calendar, 
  CheckSquare, 
  File, 
  FolderKanban, 
  Home, 
  Menu, 
  Settings, 
  Users, 
  X 
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface MobileNavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

function MobileNavItem({ href, label, icon, onClick }: MobileNavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-foreground",
        isActive
          ? "bg-muted text-foreground font-medium"
          : "text-muted-foreground"
      )}
      onClick={onClick}
    >
      {icon}
      {label}
    </Link>
  );
}

export function MobileNav() {
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
              <div className="bg-primary rounded-lg w-8 h-8 flex items-center justify-center">
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
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}