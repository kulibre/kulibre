
import { Calendar, File, FolderKanban, Home, Settings, CheckSquare, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
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
