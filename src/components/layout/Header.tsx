
import { Bell, Search, Settings, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userInitials, setUserInitials] = useState("JS");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Fetch user profile when component mounts
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Get profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile && profile.full_name) {
          // Generate initials from full name
          const names = profile.full_name.split(' ');
          const initials = names.length > 1
            ? `${names[0][0]}${names[names.length - 1][0]}`
            : names[0].substring(0, 2);

          setUserInitials(initials.toUpperCase());
        } else {
          // Use email as fallback
          const email = user.email || '';
          setUserInitials(email.substring(0, 2).toUpperCase());
        }
      }
    };

    fetchUserProfile();
  }, []);



  return (
    <header className="border-b py-3 px-6 flex items-center justify-between bg-white">
      <div className="flex items-center gap-3 md:w-1/3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 w-full rounded-md border border-input bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
          <span className="absolute -top-1 -right-1 bg-kulibre-purple text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-9 w-9 rounded-full bg-kulibre-purple flex items-center justify-center text-white font-medium outline-none">
              {userInitials}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings" className="cursor-pointer flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="cursor-pointer flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await supabase.auth.signOut();
                toast({
                  title: "Signed out",
                  description: "You have been signed out successfully.",
                });
                navigate("/login");
              }}
              className="cursor-pointer flex items-center text-red-500"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
