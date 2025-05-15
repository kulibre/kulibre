import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";

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
import { Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Form schema
const formSchema = z.object({
  theme: z.enum(["light", "dark", "system"], {
    required_error: "Please select a theme",
  }),
  color_scheme: z.enum(["default", "blue", "green", "purple", "orange"], {
    required_error: "Please select a color scheme",
  }),
  sidebar_position: z.enum(["left", "right"], {
    required_error: "Please select a sidebar position",
  }),
  density: z.enum(["default", "compact", "comfortable"], {
    required_error: "Please select a density",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface AppearanceSettingsFormProps {
  profile: any;
}

export function AppearanceSettingsForm({ profile }: AppearanceSettingsFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { setTheme } = useTheme();

  // Form definition
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      theme: profile?.appearance_settings?.theme || "system",
      color_scheme: profile?.appearance_settings?.color_scheme || "default",
      sidebar_position: profile?.appearance_settings?.sidebar_position || "left",
      density: profile?.appearance_settings?.density || "default",
    },
  });

  // Update appearance settings mutation
  const updateAppearanceMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { data, error } = await supabase
        .from("profiles")
        .update({
          appearance_settings: values,
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Appearance settings updated",
        description: "Your appearance preferences have been saved.",
      });
      
      // Update theme
      if (data?.appearance_settings?.theme) {
        setTheme(data.appearance_settings.theme);
      }
      
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update appearance settings",
        variant: "destructive",
      });
    },
  });

  // Form submission
  const onSubmit = (values: FormValues) => {
    updateAppearanceMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Theme</FormLabel>
              <FormDescription>
                Select the theme for the dashboard.
              </FormDescription>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-3 gap-4 pt-2"
                >
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem
                        value="light"
                        className="peer sr-only"
                        id="theme-light"
                      />
                    </FormControl>
                    <label
                      htmlFor="theme-light"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:border-accent hover:bg-accent/5 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="mb-2 rounded-md bg-white p-1 shadow-sm">
                        {/* Light theme preview */}
                        <div className="space-y-2">
                          <div className="h-2 w-[80px] rounded bg-gray-200" />
                          <div className="h-2 w-[100px] rounded bg-gray-200" />
                        </div>
                      </div>
                      <span className="block w-full text-center font-normal">
                        Light
                      </span>
                    </label>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem
                        value="dark"
                        className="peer sr-only"
                        id="theme-dark"
                      />
                    </FormControl>
                    <label
                      htmlFor="theme-dark"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-gray-950 p-4 hover:border-accent hover:bg-accent/5 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="mb-2 rounded-md bg-gray-800 p-1 shadow-sm">
                        {/* Dark theme preview */}
                        <div className="space-y-2">
                          <div className="h-2 w-[80px] rounded bg-gray-600" />
                          <div className="h-2 w-[100px] rounded bg-gray-600" />
                        </div>
                      </div>
                      <span className="block w-full text-center font-normal text-white">
                        Dark
                      </span>
                    </label>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem
                        value="system"
                        className="peer sr-only"
                        id="theme-system"
                      />
                    </FormControl>
                    <label
                      htmlFor="theme-system"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-gradient-to-r from-white to-gray-950 p-4 hover:border-accent hover:bg-accent/5 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="mb-2 rounded-md bg-gradient-to-r from-white to-gray-800 p-1 shadow-sm">
                        {/* System theme preview */}
                        <div className="space-y-2">
                          <div className="h-2 w-[80px] rounded bg-gradient-to-r from-gray-200 to-gray-600" />
                          <div className="h-2 w-[100px] rounded bg-gradient-to-r from-gray-200 to-gray-600" />
                        </div>
                      </div>
                      <span className="block w-full text-center font-normal">
                        System
                      </span>
                    </label>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color_scheme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color Scheme</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a color scheme" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the primary color scheme for the interface.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sidebar_position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sidebar Position</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sidebar position" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose which side the sidebar appears on.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="density"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interface Density</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select interface density" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="comfortable">Comfortable</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Adjust the spacing and density of the interface elements.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={updateAppearanceMutation.isPending || !form.formState.isDirty}
        >
          {updateAppearanceMutation.isPending ? (
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
