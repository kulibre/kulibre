
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

// Import settings components
import { ProfileSettingsForm } from "@/components/settings/ProfileSettingsForm";
import { AccountSettingsForm } from "@/components/settings/AccountSettingsForm";
import { NotificationSettingsForm } from "@/components/settings/NotificationSettingsForm";
import { AppearanceSettingsForm } from "@/components/settings/AppearanceSettingsForm";
import { SecuritySettingsForm } from "@/components/settings/SecuritySettingsForm";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  // Fetch user profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      return data;
    }
  });

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('tab', value);
    window.history.pushState({}, '', url);
  };

  // Set initial tab from URL
  useEffect(() => {
    const url = new URL(window.location.href);
    const tabParam = url.searchParams.get('tab');
    if (tabParam && ['profile', 'account', 'notifications', 'appearance', 'security'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <ProfileSettingsForm profile={profile} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <AccountSettingsForm profile={profile} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <NotificationSettingsForm profile={profile} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <AppearanceSettingsForm profile={profile} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <SecuritySettingsForm profile={profile} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
