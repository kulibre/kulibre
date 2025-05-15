import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CalendarSimple() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p className="text-muted-foreground mt-1">View and manage your schedule</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Simple Calendar</CardTitle>
        </CardHeader>
        <CardContent>
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

          <div className="mt-4">
            <p>Selected date: {date ? date.toDateString() : 'None'}</p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={() => window.location.reload()}>Refresh Page</Button>
    </div>
  );
}