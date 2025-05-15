import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, isValid } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function CalendarStep3() {
  console.log("CalendarStep3 component rendering...");

  try {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();

    interface CalendarEvent {
      id: string;
      title: string;
      description: string | null;
      event_type: "task" | "meeting" | "milestone" | "reminder";
      start_date: string;
      end_date: string | null;
    }

    interface CalendarEvents {
      events: CalendarEvent[];
      tasks: any[];
    }

    // Query that fetches tasks and calendar events
    const { data: events, isLoading, error } = useQuery<CalendarEvents>({
      queryKey: ['calendar-events', searchQuery],
      queryFn: async () => {
        console.log("Executing calendar query");
        try {
          // Fetch tasks
          const { data: tasksData, error: tasksError } = await supabase
            .from('tasks')
            .select(`
              id,
              title,
              due_date,
              priority,
              description,
              status,
              project:project_id (id, name),
              assignee:assigned_to (id, full_name)
            `)
            .ilike('title', `%${searchQuery}%`);

          if (tasksError) {
            console.error("Error fetching tasks:", tasksError);
          }

          console.log("Tasks fetched:", tasksData?.length || 0);

          // Fetch calendar events
          const { data: eventsData, error: eventsError } = await supabase
            .from('calendar_events')
            .select('*')
            .ilike('title', `%${searchQuery}%`);

          if (eventsError) {
            console.error("Error fetching calendar events:", eventsError);
          }

          // Return combined data structure
          return {
            events: eventsData || [],
            tasks: tasksData || []
          };
        } catch (err) {
          console.error("Calendar query error:", err);
          toast({
            title: "Error",
            description: "Failed to load calendar data.",
            variant: "destructive",
          });
          return { events: [], tasks: [] };
        }
      }
    });

    // Function to format date for comparison
    const formatDateForComparison = (dateString: string | Date) => {
      try {
        const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
        return isValid(date) ? format(date, 'yyyy-MM-dd') : null;
      } catch (error) {
        console.error("Invalid date:", dateString);
        return null;
      }
    };

    // Filter tasks based on the selected date
    const selectedDateTasks = events?.tasks ? events.tasks.filter(task => {
      try {
        if (!task.due_date) return false;
        const taskDate = formatDateForComparison(task.due_date);
        const selectedDate = formatDateForComparison(date || new Date());
        return taskDate === selectedDate;
      } catch (error) {
        console.error("Error filtering task:", error);
        return false;
      }
    }) : [];

    // Function to get task priority badge color
    const getTaskPriorityColor = (priority: string) => {
      const colors: Record<string, string> = {
        high: "bg-red-100 text-red-800",
        medium: "bg-amber-100 text-amber-800",
        low: "bg-green-100 text-green-800"
      };
      return colors[priority] || "bg-gray-100 text-gray-800";
    };

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground mt-1">View and manage your schedule</p>
        </div>

        <Input
          type="text"
          placeholder="Search tasks..."
          className="mb-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-6">
          <Card>
            <CardContent className="pt-6">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border calendar-fix"
                components={{
                  Day: ({ date: dayDate, ...props }) => {
                    return (
                      <div
                        {...props}
                        data-day
                      >
                        {dayDate.getDate()}
                      </div>
                    );
                  }
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Tasks for {date ? format(date, 'MMMM d, yyyy') : 'Today'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <p className="text-center py-4">Loading tasks...</p>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500 mb-2">Error loading tasks</p>
                  <p className="text-muted-foreground">There was a problem loading your tasks. Please try again later.</p>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="mt-4"
                  >
                    Refresh Page
                  </Button>
                </div>
              ) : (
                <>
                  {selectedDateTasks.length > 0 ? (
                    <div className="space-y-2">
                      {selectedDateTasks.map(task => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{task.title}</p>
                            {task.priority && (
                              <Badge className={`${getTaskPriorityColor(task.priority)} mt-1`} variant="outline">
                                {task.priority} priority
                              </Badge>
                            )}
                            {task.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No tasks due for this day
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in CalendarStep3:", error);
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Calendar Error</h1>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">There was an error rendering the calendar component.</p>
          <p className="text-sm text-red-500 mt-2">
            Error details: {error instanceof Error ? error.message : String(error)}
          </p>
        </div>
      </div>
    );
  }
}