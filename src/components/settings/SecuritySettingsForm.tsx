import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
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
import { Loader2, AlertTriangle, ShieldCheck, KeyRound, Eye, EyeOff, Clock, LogOut } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

// Form schema
const formSchema = z.object({
  two_factor_enabled: z.boolean().default(false),
  login_notifications: z.boolean().default(true),
  trusted_devices: z.boolean().default(true),
});

// Password change schema
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
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
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>("security-settings");

  // Get current user
  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    }
  });

  // Security settings form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      two_factor_enabled: profile?.security_settings?.two_factor_enabled ?? false,
      login_notifications: profile?.security_settings?.login_notifications ?? true,
      trusted_devices: profile?.security_settings?.trusted_devices ?? true,
    },
  });

  // Password change form
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Security activity log
  const [securityActivity, setSecurityActivity] = useState([
    {
      id: 1,
      type: "login",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      details: "Successful login from Chrome on Windows",
      ip: "192.168.1.1",
    },
    {
      id: 2,
      type: "password_change",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      details: "Password changed successfully",
      ip: "192.168.1.1",
    },
    {
      id: 3,
      type: "login_attempt",
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      details: "Failed login attempt",
      ip: "203.0.113.1",
    },
  ]);

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

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (values: { currentPassword: string; newPassword: string }) => {
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword,
      });

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      passwordForm.reset();

      // Add to security activity log
      setSecurityActivity((prev) => [
        {
          id: Date.now(),
          type: "password_change",
          date: new Date().toISOString(),
          details: "Password changed successfully",
          ip: "192.168.1.1", // In a real app, you would get the actual IP
        },
        ...prev,
      ]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive",
      });
    },
  });

  // Setup two-factor authentication
  const setupTwoFactorMutation = useMutation({
    mutationFn: async () => {
      // In a real implementation, you would use a proper 2FA library
      // This is a more realistic implementation using a proper format

      // Generate a random secret (in a real app, use a proper TOTP library)
      const generateSecret = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let secret = '';
        for (let i = 0; i < 16; i++) {
          secret += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return secret;
      };

      const secret = generateSecret();

      // Get user email for the QR code
      const userEmail = currentUser?.email || "user@example.com";

      // Create a proper otpauth URL
      const otpauthUrl = `otpauth://totp/Kulibre:${userEmail}?secret=${secret}&issuer=Kulibre&algorithm=SHA1&digits=6&period=30`;

      // Generate QR code URL
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`;

      return { secret, qrCodeUrl };
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
      // In a real app, you would verify the code against the secret using a TOTP library

      // For now, we'll validate the format and accept any valid 6-digit code
      if (!/^\d{6}$/.test(code)) {
        throw new Error("Invalid verification code");
      }

      // In a real implementation, you would store the secret in the database
      // securely and associate it with the user's account

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

      // Add to security activity log
      setSecurityActivity((prev) => [
        {
          id: Date.now(),
          type: "2fa_enabled",
          date: new Date().toISOString(),
          details: "Two-factor authentication enabled",
          ip: "192.168.1.1", // In a real app, you would get the actual IP
        },
        ...prev,
      ]);

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

  // Handle password form submission
  const onPasswordSubmit = passwordForm.handleSubmit((data) => {
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  });

  // Security settings form submission
  const onSubmit = (values: FormValues) => {
    // If user is trying to enable 2FA, show setup first
    if (values.two_factor_enabled && !profile?.security_settings?.two_factor_enabled) {
      setupTwoFactorMutation.mutate();
      return;
    }

    // If user is disabling 2FA, add to security activity log
    if (!values.two_factor_enabled && profile?.security_settings?.two_factor_enabled) {
      setSecurityActivity((prev) => [
        {
          id: Date.now(),
          type: "2fa_disabled",
          date: new Date().toISOString(),
          details: "Two-factor authentication disabled",
          ip: "192.168.1.1", // In a real app, you would get the actual IP
        },
        ...prev,
      ]);
    }

    // Save the settings
    updateSecurityMutation.mutate(values);
  };

  return (
    <div className="space-y-8">
      <Accordion
        type="single"
        collapsible
        value={activeSection}
        onValueChange={setActiveSection}
        className="w-full"
      >
        {/* Security Settings Section */}
        <AccordionItem value="security-settings">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center">
              <ShieldCheck className="mr-2 h-5 w-5" />
              Security Settings
            </div>
          </AccordionTrigger>
          <AccordionContent>
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

                      <div className="flex justify-center mt-2">
                        <InputOTP
                          maxLength={6}
                          value={verificationCode}
                          onChange={setVerificationCode}
                          render={({ slots }) => (
                            <InputOTPGroup>
                              {slots.map((slot, index) => (
                                <InputOTPSlot key={index} {...slot} />
                              ))}
                            </InputOTPGroup>
                          )}
                        />
                      </div>

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
          </AccordionContent>
        </AccordionItem>

        {/* Password Change Section */}
        <AccordionItem value="password-change">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center">
              <KeyRound className="mr-2 h-5 w-5" />
              Change Password
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Change Your Password</CardTitle>
                <CardDescription>
                  Choose a strong, unique password that you don't use for other accounts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onPasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        {...passwordForm.register("currentPassword")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        {...passwordForm.register("newPassword")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        {...passwordForm.register("confirmPassword")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={changePasswordMutation.isPending || !passwordForm.formState.isDirty}
                  >
                    {changePasswordMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Security Activity Section */}
        <AccordionItem value="security-activity">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Security Activity
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Recent Security Activity</CardTitle>
                <CardDescription>
                  Review recent security events for your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 rounded-lg border p-4">
                      <div className="mt-0.5">
                        {activity.type === "login" && <ShieldCheck className="h-5 w-5 text-green-500" />}
                        {activity.type === "login_attempt" && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                        {activity.type === "password_change" && <KeyRound className="h-5 w-5 text-blue-500" />}
                        {activity.type === "2fa_enabled" && <ShieldCheck className="h-5 w-5 text-green-500" />}
                        {activity.type === "2fa_disabled" && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">{activity.details}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString()}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">IP: {activity.ip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Active Sessions Section */}
        <AccordionItem value="active-sessions">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center">
              <LogOut className="mr-2 h-5 w-5" />
              Active Sessions
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Manage Active Sessions</CardTitle>
                <CardDescription>
                  View and manage devices where you're currently logged in.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 rounded-lg border p-4">
                    <div className="mt-0.5">
                      <ShieldCheck className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">Current Session (Chrome on Windows)</p>
                        <p className="text-sm text-muted-foreground">
                          Active now
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">IP: 192.168.1.1</p>
                    </div>
                    <Button variant="ghost" size="sm" disabled>
                      Current
                    </Button>
                  </div>

                  <div className="flex items-start space-x-4 rounded-lg border p-4">
                    <div className="mt-0.5">
                      <ShieldCheck className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">Safari on iPhone</p>
                        <p className="text-sm text-muted-foreground">
                          Last active: 2 days ago
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">IP: 203.0.113.1</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Sign Out
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="destructive" className="w-full">
                  Sign Out All Other Sessions
                </Button>
              </CardFooter>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
