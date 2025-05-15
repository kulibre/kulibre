import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

// Form schema
const formSchema = z.object({
  two_factor_enabled: z.boolean().default(false),
  login_notifications: z.boolean().default(true),
  trusted_devices: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface SecuritySettingsFormProps {
  profile: any;
}

export function SecuritySettingsForm({ profile }: SecuritySettingsFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [twoFactorSecret, setTwoFactorSecret] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  // Form definition
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      two_factor_enabled: profile?.security_settings?.two_factor_enabled ?? false,
      login_notifications: profile?.security_settings?.login_notifications ?? true,
      trusted_devices: profile?.security_settings?.trusted_devices ?? true,
    },
  });

  // Update security settings mutation
  const updateSecurityMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { data, error } = await supabase
        .from("profiles")
        .update({
          security_settings: values,
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Security settings updated",
        description: "Your security preferences have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update security settings",
        variant: "destructive",
      });
    },
  });

  // Setup two-factor authentication
  const setupTwoFactorMutation = useMutation({
    mutationFn: async () => {
      // This is a mock implementation since Supabase doesn't have built-in 2FA
      // In a real app, you would use a proper 2FA library or service
      
      // Simulate generating a secret and QR code
      const mockSecret = "ABCDEFGHIJKLMNOP";
      const mockQrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Kulibre:user@example.com?secret=" + mockSecret + "&issuer=Kulibre";
      
      // In a real implementation, you would store this secret securely
      return { secret: mockSecret, qrCodeUrl: mockQrCodeUrl };
    },
    onSuccess: (data) => {
      setTwoFactorSecret(data.secret);
      setQrCodeUrl(data.qrCodeUrl);
      setShowTwoFactorSetup(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to setup two-factor authentication",
        variant: "destructive",
      });
    },
  });

  // Verify two-factor code
  const verifyTwoFactorMutation = useMutation({
    mutationFn: async (code: string) => {
      // This is a mock implementation
      // In a real app, you would verify the code against the secret
      
      // Simulate verification (accept any 6-digit code for demo)
      if (!/^\d{6}$/.test(code)) {
        throw new Error("Invalid verification code");
      }
      
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Two-factor authentication enabled",
        description: "Your account is now more secure.",
      });
      
      // Update the form and save settings
      form.setValue("two_factor_enabled", true);
      updateSecurityMutation.mutate({
        ...form.getValues(),
        two_factor_enabled: true,
      });
      
      // Reset state
      setShowTwoFactorSetup(false);
      setVerificationCode("");
      setTwoFactorSecret("");
      setQrCodeUrl("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to verify code",
        variant: "destructive",
      });
    },
  });

  // Form submission
  const onSubmit = (values: FormValues) => {
    // If user is trying to enable 2FA, show setup first
    if (values.two_factor_enabled && !profile?.security_settings?.two_factor_enabled) {
      setupTwoFactorMutation.mutate();
      return;
    }
    
    // Otherwise just save the settings
    updateSecurityMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="two_factor_enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
                  <FormDescription>
                    Add an extra layer of security to your account by requiring a verification code.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="login_notifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Login Notifications</FormLabel>
                  <FormDescription>
                    Receive email notifications when someone logs into your account.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trusted_devices"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Remember Trusted Devices</FormLabel>
                  <FormDescription>
                    Stay logged in on devices you use regularly.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {showTwoFactorSetup && (
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="text-lg font-medium">Set Up Two-Factor Authentication</h3>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                1. Scan this QR code with your authenticator app (like Google Authenticator, Authy, or 1Password).
              </p>
              <div className="flex justify-center">
                <img src={qrCodeUrl} alt="QR Code for 2FA" className="h-48 w-48" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                2. Enter the 6-digit verification code from your authenticator app.
              </p>
              <Input
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full max-w-xs mx-auto"
                maxLength={6}
              />
              
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Save this backup code somewhere safe. You'll need it if you lose access to your authenticator app: <strong>{twoFactorSecret}</strong>
                </AlertDescription>
              </Alert>
              
              <div className="flex space-x-2 mt-4">
                <Button 
                  type="button" 
                  onClick={() => verifyTwoFactorMutation.mutate(verificationCode)}
                  disabled={verificationCode.length !== 6 || verifyTwoFactorMutation.isPending}
                >
                  {verifyTwoFactorMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Enable"
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowTwoFactorSetup(false);
                    form.setValue("two_factor_enabled", false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {!showTwoFactorSetup && (
          <Button 
            type="submit" 
            disabled={updateSecurityMutation.isPending || setupTwoFactorMutation.isPending || !form.formState.isDirty}
          >
            {(updateSecurityMutation.isPending || setupTwoFactorMutation.isPending) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        )}
      </form>
    </Form>
  );
}
