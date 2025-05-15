import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Form schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormValues = z.infer<typeof formSchema>;

interface AccountSettingsFormProps {
  profile: any;
}

export function AccountSettingsForm({ profile }: AccountSettingsFormProps) {
  const { toast } = useToast();
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Email form
  const emailForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: profile?.email || "",
    },
  });

  // Password form
  const passwordFormSchema = z.object({
    currentPassword: z.string().min(1, { message: "Current password is required" }),
    newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update email mutation
  const updateEmailMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { error } = await supabase.auth.updateUser({
        email: values.email,
      });

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Email update initiated",
        description: "Please check your new email for a confirmation link.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update email",
        variant: "destructive",
      });
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async (values: z.infer<typeof passwordFormSchema>) => {
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: values.currentPassword,
      });

      if (signInError) throw new Error("Current password is incorrect");

      // Then update the password
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword,
      });

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
      setShowPasswordForm(false);
      passwordForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    },
  });

  // Form submissions
  const onEmailSubmit = (values: FormValues) => {
    updateEmailMutation.mutate(values);
  };

  const onPasswordSubmit = (values: z.infer<typeof passwordFormSchema>) => {
    updatePasswordMutation.mutate(values);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium">Email Address</h3>
        <p className="text-sm text-muted-foreground">
          Update your email address. You'll need to verify the new email.
        </p>

        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="mt-4 space-y-4">
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={updateEmailMutation.isPending || !emailForm.formState.isDirty}
            >
              {updateEmailMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Email"
              )}
            </Button>
          </form>
        </Form>
      </div>

      <div>
        <h3 className="text-lg font-medium">Password</h3>
        <p className="text-sm text-muted-foreground">
          Change your password to keep your account secure.
        </p>

        {!showPasswordForm ? (
          <Button 
            className="mt-4" 
            variant="outline" 
            onClick={() => setShowPasswordForm(true)}
          >
            Change Password
          </Button>
        ) : (
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="mt-4 space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Password must be at least 8 characters long.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex space-x-2">
                <Button 
                  type="submit" 
                  disabled={updatePasswordMutation.isPending}
                >
                  {updatePasswordMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowPasswordForm(false);
                    passwordForm.reset();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium">Delete Account</h3>
        <p className="text-sm text-muted-foreground">
          Permanently delete your account and all of your content.
        </p>

        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
          </AlertDescription>
        </Alert>

        <Button 
          className="mt-4" 
          variant="destructive" 
          onClick={() => {
            toast({
              title: "Account deletion",
              description: "Please contact support to delete your account.",
            });
          }}
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
}
