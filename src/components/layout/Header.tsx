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
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Get profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // Check for Google avatar in user metadata
        const googleAvatar = user.user_metadata?.avatar_url;
        if (googleAvatar) {
          setUserAvatar(googleAvatar);
        }

        if (profile && profile.full_name) {
          // Generate initials from full name
          const names = profile.full_name.split(' ');
          const initials = names.length > 1
            ? `${names[0][0]}${names[names.length - 1][0]}`
            : names[0].substring(0, 2);

          setUserInitials(initials.toUpperCase());
        } else {
          // Use Google display name if available
          const googleName = user.user_metadata?.full_name;
          if (googleName) {
            const names = googleName.split(' ');
            const initials = names.length > 1
              ? `${names[0][0]}${names[names.length - 1][0]}`
              : names[0].substring(0, 2);
            setUserInitials(initials.toUpperCase());

            // Create profile if it doesn't exist
            await supabase
              .from('profiles')
              .upsert({
                id: user.id,
                full_name: googleName,
                avatar_url: googleAvatar,
                email: user.email
              });
          } else {
            // Fallback to email
            const email = user.email || '';
            setUserInitials(email.substring(0, 2).toUpperCase());
          }
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center space-x-2">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="bg-kulibre-purple rounded-lg w-8 h-8 flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="font-semibold">kulibre</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2">
          <nav className="flex items-center space-x-6">
            <Link 
              to="/pricing" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Bell className="h-5 w-5 cursor-pointer text-muted-foreground hover:text-foreground" />
            
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt="User avatar" 
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-kulibre-purple text-white flex items-center justify-center text-sm font-medium">
                    {userInitials}
                  </div>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
