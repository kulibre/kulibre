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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

// Form schema
const formSchema = z.object({
  full_name: z.string().min(1, { message: "Full name is required" }),
  job_title: z.string().optional(),
  department: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().optional(),
  avatar_url: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProfileSettingsFormProps {
  profile: any;
}

export function ProfileSettingsForm({ profile }: ProfileSettingsFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  // Form definition
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      job_title: profile?.job_title || "",
      department: profile?.department || "",
      company: profile?.company || "",
      bio: profile?.bio || "",
      avatar_url: profile?.avatar_url || "",
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      // Check if avatar_url is a data URL (starts with "data:")
      let processedValues = { ...values };

      if (values.avatar_url && values.avatar_url.startsWith('data:')) {
        try {
          // For data URLs, we'll try to upload to the file_uploads bucket instead
          // Extract the base64 data from the data URL
          const base64Data = values.avatar_url.split(',')[1];
          const contentType = values.avatar_url.split(';')[0].split(':')[1];

          // Convert base64 to blob
          const byteCharacters = atob(base64Data);
          const byteArrays = [];

          for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
          }

          const blob = new Blob(byteArrays, { type: contentType });
          const file = new File([blob], "avatar.jpg", { type: contentType });

          // Try to upload to the file_uploads bucket (which we know exists)
          const fileName = `avatars/${user.id}-${Math.random().toString(36).substring(2)}.jpg`;

          const { error: uploadError } = await supabase.storage
            .from('file_uploads')
            .upload(fileName, file);

          if (uploadError) {
            console.error("Error uploading avatar to file_uploads bucket:", uploadError);
            // Continue with the data URL if upload fails
          } else {
            // Get the public URL
            const { data: { publicUrl } } = supabase.storage
              .from('file_uploads')
              .getPublicUrl(fileName);

            // Update the avatar_url with the public URL
            processedValues.avatar_url = publicUrl;
          }
        } catch (error) {
          console.error("Error processing data URL:", error);
          // Continue with the data URL if processing fails
        }
      }

      const { data, error } = await supabase
        .from("profiles")
        .update(processedValues)
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  // Handle avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input change event triggered");
    const file = event.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("File selected:", file.name);

    try {
      setIsUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      // Instead of using Supabase storage, we'll use a temporary URL for the avatar
      // This is a workaround since we can't create buckets with the anon key

      // Create a temporary URL for the avatar using FileReader
      const reader = new FileReader();

      // Create a promise to wait for the FileReader to complete
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      console.log("Created data URL for image");

      // Update the form with the data URL and mark as dirty
      form.setValue("avatar_url", dataUrl, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      });

      toast({
        title: "Avatar selected",
        description: "Your avatar has been selected. Click 'Save Changes' to update your profile.",
      });
    } catch (error: any) {
      console.error("Avatar handling error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process avatar",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Form submission
  const onSubmit = (values: FormValues) => {
    updateProfileMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={form.watch("avatar_url")} />
            <AvatarFallback>
              {profile?.full_name?.split(" ").map((n: string) => n[0]).join("") || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // Reset the input value to ensure onChange fires even if selecting the same file
                const fileInput = document.getElementById("avatar-upload") as HTMLInputElement;
                if (fileInput) {
                  fileInput.value = "";
                  fileInput.click();
                }
              }}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Change Avatar"
              )}
            </Button>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={isUploading}
              key="avatar-upload-input" // Force React to recreate this element
            />
            <p className="text-sm text-muted-foreground mt-1">
              JPG, PNG or GIF. 1MB max.
            </p>
          </div>
        </div>

        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="job_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="Product Manager" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input placeholder="Product" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="Acme Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Brief description for your profile.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={updateProfileMutation.isPending || !form.formState.isDirty}
        >
          {updateProfileMutation.isPending ? (
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
