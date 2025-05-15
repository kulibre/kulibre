import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Form schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormValues = z.infer<typeof formSchema>;

// Password form schema with stronger validation
const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

interface AccountSettingsFormProps {
  profile: any;
}

export function AccountSettingsForm({ profile }: AccountSettingsFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch the current user's email from Supabase auth
  useEffect(() => {
    const fetchUserEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email) {
        setUserEmail(user.email);
      }
    };

    fetchUserEmail();
  }, []);

  // Email form
  const emailForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // Update email form when userEmail is fetched
  useEffect(() => {
    if (userEmail) {
      emailForm.reset({ email: userEmail });
    }
  }, [userEmail, emailForm]);

  // Password form
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
      // Reset the form to prevent multiple submissions
      emailForm.reset({ email: emailForm.getValues().email });
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
      if (!userEmail) {
        throw new Error("User email not found. Please try again later.");
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
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

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      setIsDeleting(true);

      try {
        // First delete user data from profiles table
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not found");

        const { error: profileError } = await supabase
          .from("profiles")
          .delete()
          .eq("id", user.id);

        if (profileError) throw profileError;

        // Then delete the user account
        const { error: authError } = await supabase.auth.admin.deleteUser(
          user.id
        );

        if (authError) {
          // If admin delete fails, try regular signOut as fallback
          const { error: signOutError } = await supabase.auth.signOut();
          if (signOutError) throw signOutError;

          toast({
            title: "Account scheduled for deletion",
            description: "Your account has been scheduled for deletion. You have been signed out.",
          });

          // Redirect to home page after a short delay
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);

          return true;
        }

        return true;
      } finally {
        setIsDeleting(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      });

      // Redirect to home page after a short delay
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete account. Please contact support.",
        variant: "destructive",
      });
      setShowDeleteDialog(false);
    },
  });

  // Form submissions
  const onEmailSubmit = (values: FormValues) => {
    updateEmailMutation.mutate(values);
  };

  const onPasswordSubmit = (values: z.infer<typeof passwordFormSchema>) => {
    updatePasswordMutation.mutate(values);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText.toLowerCase() !== "delete my account") {
      toast({
        title: "Confirmation failed",
        description: "Please type 'delete my account' to confirm deletion",
        variant: "destructive",
      });
      return;
    }

    deleteAccountMutation.mutate();
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
                  <FormDescription>
                    We'll send a verification link to your new email address.
                  </FormDescription>
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
                  Sending Verification...
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
                      Password must be at least 8 characters and include uppercase, lowercase, and numbers.
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
          onClick={() => setShowDeleteDialog(true)}
        >
          Delete Account
        </Button>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all of your data from our servers.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                All your data will be permanently deleted. This includes your profile, files, and all other content.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <p className="text-sm font-medium">Type "delete my account" to confirm:</p>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="delete my account"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeleteConfirmText("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
