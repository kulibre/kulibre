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
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

// Form schema
const formSchema = z.object({
  email_notifications: z.boolean().default(true),
  push_notifications: z.boolean().default(true),
  task_reminders: z.boolean().default(true),
  project_updates: z.boolean().default(true),
  team_activity: z.boolean().default(true),
  marketing_emails: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface NotificationSettingsFormProps {
  profile: any;
}

export function NotificationSettingsForm({ profile }: NotificationSettingsFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form definition
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email_notifications: profile?.notification_settings?.email_notifications ?? true,
      push_notifications: profile?.notification_settings?.push_notifications ?? true,
      task_reminders: profile?.notification_settings?.task_reminders ?? true,
      project_updates: profile?.notification_settings?.project_updates ?? true,
      team_activity: profile?.notification_settings?.team_activity ?? true,
      marketing_emails: profile?.notification_settings?.marketing_emails ?? false,
    },
  });

  // Update notification settings mutation
  const updateNotificationsMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { data, error } = await supabase
        .from("profiles")
        .update({
          notification_settings: values,
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update notification settings",
        variant: "destructive",
      });
    },
  });

  // Form submission
  const onSubmit = (values: FormValues) => {
    updateNotificationsMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Email Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Configure which email notifications you receive.
            </p>
          </div>

          <FormField
            control={form.control}
            name="email_notifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Email Notifications</FormLabel>
                  <FormDescription>
                    Receive email notifications for important updates.
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
            name="task_reminders"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Task Reminders</FormLabel>
                  <FormDescription>
                    Get reminders about upcoming and overdue tasks.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={!form.watch("email_notifications")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="project_updates"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Project Updates</FormLabel>
                  <FormDescription>
                    Receive notifications about changes to your projects.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={!form.watch("email_notifications")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="team_activity"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Team Activity</FormLabel>
                  <FormDescription>
                    Get updates about team member actions and comments.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={!form.watch("email_notifications")}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Push Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Configure which push notifications you receive.
            </p>
          </div>

          <FormField
            control={form.control}
            name="push_notifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Push Notifications</FormLabel>
                  <FormDescription>
                    Receive push notifications in your browser.
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

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Marketing</h3>
            <p className="text-sm text-muted-foreground">
              Configure marketing communication preferences.
            </p>
          </div>

          <FormField
            control={form.control}
            name="marketing_emails"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Marketing Emails</FormLabel>
                  <FormDescription>
                    Receive emails about new features, tips, and product updates.
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

        <Button 
          type="submit" 
          disabled={updateNotificationsMutation.isPending || !form.formState.isDirty}
        >
          {updateNotificationsMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </Form>
  );
}
