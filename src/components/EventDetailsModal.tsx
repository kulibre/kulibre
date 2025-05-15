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
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, isValid } from "date-fns";
import { useState } from "react";
import { Calendar, Clock, Trash2, Users, FileText, Briefcase } from "lucide-react";

interface EventDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: any;
  onEventUpdated?: () => void;
}

export function EventDetailsModal({ open, onOpenChange, event, onEventUpdated }: EventDetailsModalProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, "PPP") : "Invalid date";
    } catch (error) {
      return "Invalid date";
    }
  };

  // Function to format time
  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, "h:mm a") : "";
    } catch (error) {
      return "";
    }
  };

  // Function to get event type badge color
  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      task: "bg-blue-100 text-blue-800",
      meeting: "bg-purple-100 text-purple-800",
      milestone: "bg-green-100 text-green-800",
      reminder: "bg-amber-100 text-amber-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  // Function to delete event
  const handleDeleteEvent = async () => {
    if (!event?.id) return;

    setIsDeleting(true);

    try {
      // Check if this is a calendar event or a task
      if (event.event_type === 'task' && !event.all_day && !event.calendar_event) {
        // This is likely a task from the tasks table
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', event.id);

        if (error) throw error;
      } else {
        // This is a calendar event
        const { error } = await supabase
          .from('calendar_events')
          .delete()
          .eq('id', event.id);

        if (error) throw error;
      }

      toast({
        title: "Event deleted",
        description: "The event has been removed from your calendar.",
      });

      onOpenChange(false);

      // Call callback if provided
      if (onEventUpdated) {
        onEventUpdated();
      }
    } catch (error: any) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error deleting event",
        description: error.message || "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Function to handle edit button click
  const handleEditClick = () => {
    setIsEditing(true);
    // Close the details modal
    onOpenChange(false);

    // We'll use the existing NewEventModal for editing by passing the event data
    // This will be handled in the parent component (Calendar.tsx)
    if (onEventUpdated) {
      onEventUpdated();
    }
  };

  if (!event) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[500px] max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">{event?.title}</AlertDialogTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            {event?.event_type && (
              <Badge className={getEventTypeColor(event.event_type)}>
                {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
              </Badge>
            )}
            {event?.all_day && (
              <Badge variant="outline">All day</Badge>
            )}
          </div>
        </AlertDialogHeader>
        <AlertDialogDescription className="space-y-4">
          <div className="grid grid-cols-[20px_1fr] gap-x-3 gap-y-4 items-start">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {formatDate(event?.start_date)}
                {event?.end_date && event?.start_date !== event?.end_date && (
                  <> - {formatDate(event?.end_date)}</>
                )}
              </p>
              {!event?.all_day && (
                <p className="text-sm text-muted-foreground">
                  {formatTime(event?.start_date)}
                  {event?.end_date && (
                    <> - {formatTime(event?.end_date)}</>
                  )}
                </p>
              )}
            </div>

            {event?.project && (
              <>
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <p>
                  <span className="text-sm text-muted-foreground">Project: </span>
                  <span className="font-medium">{event.project.name}</span>
                </p>
              </>
            )}

            {event?.attendees && event.attendees.length > 0 && (
              <>
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Attendees:</p>
                  <div className="space-y-1">
                    {event.attendees.map((attendee: any) => (
                      <div key={attendee.user_id} className="flex items-center justify-between">
                        <span>{attendee.profile?.full_name || "Unknown"}</span>
                        <Badge variant="outline" className="text-xs">
                          {attendee.response}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {event?.description && (
              <>
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description:</p>
                  <p className="whitespace-pre-wrap">{event.description}</p>
                </div>
              </>
            )}
          </div>
        </AlertDialogDescription>
        <AlertDialogFooter className="flex justify-between">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteEvent}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
          <div className="flex gap-2">
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction onClick={handleEditClick}>Edit</AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
