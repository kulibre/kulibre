import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CalendarStep1() {
  console.log("CalendarStep1 component rendering...");

  try {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground mt-1">View and manage your schedule</p>
        </div>

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
                Selected Date: {date ? date.toDateString() : 'None'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>This is a simplified calendar page with just the date picker.</p>
              <p className="mt-4">If you can see this, the basic UI components are working.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in CalendarStep1:", error);
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