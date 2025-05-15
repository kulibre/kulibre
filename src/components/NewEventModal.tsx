import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useQuery } from "@tanstack/react-query";

const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Event title must be at least 2 characters.",
  }),
  eventType: z.enum(["task", "meeting", "milestone", "reminder"], {
    required_error: "Please select an event type.",
  }),
  projectId: z.string().optional(),
  startDate: z.date({
    required_error: "Please select a start date.",
  }),
  startTime: z.string().optional(),
  endDate: z.date().optional(),
  endTime: z.string().optional(),
  allDay: z.boolean().default(false),
  assignedMembers: z.array(z.string()).default([]),
  description: z.string().optional(),
})

interface NewEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventCreated?: () => void;
  onEventUpdated?: () => void;
  event?: any; // The event to edit, if in edit mode
  isEditing?: boolean;
}

export function NewEventModal({
  open,
  onOpenChange,
  onEventCreated,
  onEventUpdated,
  event,
  isEditing = false
}: NewEventModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add New Event");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check if user is authenticated when modal opens
  useEffect(() => {
    if (open) {
      const checkAuth = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          setIsAuthenticated(!!user);

          if (!user) {
            toast({
              title: "Authentication required",
              description: "You must be logged in to create or update events. Please log in and try again.",
              variant: "destructive",
            });
            onOpenChange(false);
          }
        } catch (error) {
          console.error("Error checking authentication:", error);
          setIsAuthenticated(false);
          onOpenChange(false);
        }
      };

      checkAuth();
    }
  }, [open, onOpenChange, toast]);

  // Fetch projects for the dropdown
  const { data: projects } = useQuery({
    queryKey: ['projects-for-calendar'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name')
          .order('name');

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
      }
    },
    enabled: open, // Only fetch when modal is open
  });

  // Fetch team members for the dropdown
  const { data: teamMembers } = useQuery({
    queryKey: ['team-members-for-calendar'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name')
          .order('full_name');

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching team members:", error);
        return [];
      }
    },
    enabled: open, // Only fetch when modal is open
  });

  // Set up form with default values or event data if editing
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: isEditing && event ? {
      title: event.title || "",
      eventType: event.event_type || "task",
      projectId: event.project_id || "",
      startDate: event.start_date ? new Date(event.start_date) : new Date(),
      startTime: event.start_date && !event.all_day ? format(new Date(event.start_date), "HH:mm") : "09:00",
      endDate: event.end_date ? new Date(event.end_date) : undefined,
      endTime: event.end_date && !event.all_day ? format(new Date(event.end_date), "HH:mm") : "10:00",
      allDay: event.all_day || false,
      assignedMembers: event.attendees ? event.attendees.map((a: any) => a.user_id) : [],
      description: event.description || "",
    } : {
      title: "",
      eventType: "task",
      projectId: "",
      startDate: new Date(),
      startTime: "09:00",
      endDate: undefined,
      endTime: "10:00",
      allDay: false,
      assignedMembers: [],
      description: "",
    },
  });

  // Update modal title based on whether we're editing or creating
  useEffect(() => {
    setModalTitle(isEditing ? "Edit Event" : "Add New Event");

    // Reset form with event data when editing mode changes or event changes
    if (isEditing && event) {
      form.reset({
        title: event.title || "",
        eventType: event.event_type || "task",
        projectId: event.project_id || "",
        startDate: event.start_date ? new Date(event.start_date) : new Date(),
        startTime: event.start_date && !event.all_day ? format(new Date(event.start_date), "HH:mm") : "09:00",
        endDate: event.end_date ? new Date(event.end_date) : undefined,
        endTime: event.end_date && !event.all_day ? format(new Date(event.end_date), "HH:mm") : "10:00",
        allDay: event.all_day || false,
        assignedMembers: event.attendees ? event.attendees.map((a: any) => a.user_id) : [],
        description: event.description || "",
      });
    }
  }, [isEditing, event, form]);

  const watchAllDay = form.watch("allDay");

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to create or update an event. Please log in and try again.",
          variant: "destructive",
        });
        onOpenChange(false);
        return;
      }

      // Format start date with time if not all day
      let startDateTime = new Date(values.startDate);
      if (!values.allDay && values.startTime) {
        const [hours, minutes] = values.startTime.split(':').map(Number);
        startDateTime.setHours(hours, minutes);
      }

      // Format end date with time if provided and not all day
      let endDateTime = values.endDate ? new Date(values.endDate) : undefined;
      if (endDateTime && !values.allDay && values.endTime) {
        const [hours, minutes] = values.endTime.split(':').map(Number);
        endDateTime.setHours(hours, minutes);
      }

      if (isEditing && event?.id) {
        // Check if this is a task being converted to a calendar event
        if (event.is_task_conversion) {
          // Insert as a new calendar event
          const { data: eventData, error: eventError } = await supabase
            .from('calendar_events')
            .insert([{
              title: values.title,
              description: values.description,
              event_type: values.eventType,
              start_date: startDateTime.toISOString(),
              end_date: endDateTime ? endDateTime.toISOString() : null,
              all_day: values.allDay,
              project_id: values.projectId && values.projectId !== "none" ? values.projectId : null,
              created_by: user.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }])
            .select();

          if (eventError) throw eventError;

          // Use the new event ID for attendees
          event.id = eventData[0].id;
        } else {
          // Update existing calendar event
          const { error: eventError } = await supabase
            .from('calendar_events')
            .update({
              title: values.title,
              description: values.description,
              event_type: values.eventType,
              start_date: startDateTime.toISOString(),
              end_date: endDateTime ? endDateTime.toISOString() : null,
              all_day: values.allDay,
              project_id: values.projectId && values.projectId !== "none" ? values.projectId : null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', event.id);

          if (eventError) throw eventError;
        }

        // Handle attendees for the updated event
        if (values.assignedMembers.length > 0) {
          // First, delete existing attendees
          const { error: deleteError } = await supabase
            .from('event_attendees')
            .delete()
            .eq('event_id', event.id);

          if (deleteError) {
            console.error("Error deleting existing attendees:", deleteError);
          }

          // Then add the new attendees
          const attendeesData = values.assignedMembers.map(memberId => ({
            event_id: event.id,
            user_id: memberId,
            role: 'attendee',
            response: 'pending'
          }));

          const { error: attendeesError } = await supabase
            .from('event_attendees')
            .insert(attendeesData);

          if (attendeesError) {
            console.error("Error updating attendees:", attendeesError);
          }
        }

        toast({
          title: "Event updated",
          description: "Your event has been updated successfully.",
        });

        // Reset form and close modal
        form.reset();
        onOpenChange(false);

        // Call callback if provided
        if (onEventUpdated) {
          onEventUpdated();
        }
      } else {
        // Insert new event
        const { data: eventData, error: eventError } = await supabase
          .from('calendar_events')
          .insert([{
            title: values.title,
            description: values.description,
            event_type: values.eventType,
            start_date: startDateTime.toISOString(),
            end_date: endDateTime ? endDateTime.toISOString() : null,
            all_day: values.allDay,
            project_id: values.projectId && values.projectId !== "none" ? values.projectId : null,
            created_by: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }])
          .select();

        if (eventError) throw eventError;

        // Add attendees if any are selected
        if (values.assignedMembers.length > 0 && eventData && eventData[0]) {
          const attendeesData = values.assignedMembers.map(memberId => ({
            event_id: eventData[0].id,
            user_id: memberId,
            role: 'attendee',
            response: 'pending'
          }));

          const { error: attendeesError } = await supabase
            .from('event_attendees')
            .insert(attendeesData);

          if (attendeesError) {
            console.error("Error adding attendees:", attendeesError);
          }
        }

        toast({
          title: "Event created",
          description: "Your event has been added to the calendar.",
        });

        // Reset form and close modal
        form.reset();
        onOpenChange(false);

        // Call callback if provided
        if (onEventCreated) {
          onEventCreated();
        }
      }
    } catch (error: any) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} event:`, error);
      toast({
        title: `Error ${isEditing ? 'updating' : 'creating'} event`,
        description: error.message || `Failed to ${isEditing ? 'update' : 'create'} event. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[500px] max-h-[80vh] overflow-y-auto">
        {isAuthenticated === null ? (
          <div className="py-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-sm text-muted-foreground">Checking authentication...</p>
          </div>
        ) : isAuthenticated ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>{modalTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {isEditing
                  ? "Update the details of your calendar event."
                  : "Create a new event to add to your calendar."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Event Title" className="h-7" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-7">
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="task">Task Deadline</SelectItem>
                        <SelectItem value="meeting">Client Meeting</SelectItem>
                        <SelectItem value="milestone">Project Milestone</SelectItem>
                        <SelectItem value="reminder">Internal Reminder</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Related Project</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "none"}>
                      <FormControl>
                        <SelectTrigger className="h-7">
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {projects?.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="allDay"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-1">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>All-day event</FormLabel>

                  </div>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal h-7",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="calendar-fix"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!watchAllDay && (
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 opacity-50" />
                        <FormControl>
                          <Input type="time" className="h-7" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal h-7",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="calendar-fix"
                          disabled={(date) =>
                            date < form.getValues("startDate")
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!watchAllDay && (
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 opacity-50" />
                        <FormControl>
                          <Input type="time" className="h-7" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="assignedMembers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attendees</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const currentValues = field.value || [];
                      if (currentValues.includes(value)) {
                        field.onChange(currentValues.filter(v => v !== value));
                      } else {
                        field.onChange([...currentValues, value]);
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="h-7">
                        <SelectValue placeholder={
                          field.value.length > 0
                            ? `${field.value.length} attendee(s) selected`
                            : "Select attendees"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teamMembers?.map(member => (
                        <SelectItem
                          key={member.id}
                          value={member.id}
                          className={cn(
                            field.value.includes(member.id) && "bg-primary/10"
                          )}
                        >
                          {member.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.value.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Selected: {teamMembers
                        ?.filter(m => field.value.includes(m.id))
                        .map(m => m.full_name)
                        .join(", ")}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description/Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Event description"
                      className="resize-none h-16"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
        </>
        ) : (
          <div className="py-8 text-center">
            <p className="text-red-500 mb-2">Authentication Required</p>
            <p className="text-muted-foreground mb-4">You must be logged in to create or update events.</p>
            <Button
              onClick={() => window.location.href = '/login'}
              variant="default"
            >
              Go to Login
            </Button>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}
