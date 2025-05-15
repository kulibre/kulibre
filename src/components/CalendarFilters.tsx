import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useEffect } from "react"

export interface CalendarFiltersType {
  teamMember?: string;
  eventType?: "task" | "meeting" | "milestone" | "reminder";
}

const FormSchema = z.object({
  teamMember: z.string().optional(),
  eventType: z.enum(["task", "meeting", "milestone", "reminder"]).optional(),
})

interface CalendarFiltersProps {
  onFilterChange: (filters: CalendarFiltersType) => void;
}

export function CalendarFilters({ onFilterChange }: CalendarFiltersProps) {
  // Fetch team members for the dropdown
  const { data: teamMembers } = useQuery({
    queryKey: ['team-members-for-filters'],
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
  });

  const form = useForm<CalendarFiltersType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      teamMember: "all",
      eventType: "all",
    },
  });

  // Apply filters when form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      onFilterChange(value as CalendarFiltersType);
    });
    return () => subscription.unsubscribe();
  }, [form, onFilterChange]);

  function onSubmit(values: CalendarFiltersType) {
    onFilterChange(values);
  }

  function handleReset() {
    form.reset({
      teamMember: "all",
      eventType: "all",
    });
    onFilterChange({});
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="teamMember"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Member</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="All team members" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">All team members</SelectItem>
                    {teamMembers?.map(member => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="All event types" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">All event types</SelectItem>
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
        </div>
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
          >
            Reset Filters
          </Button>
        </div>
      </form>
    </Form>
  )
}
