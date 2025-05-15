import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function CalendarSimplified() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">Simplified Calendar</h1>
        <p className="text-muted-foreground mt-1">A basic calendar view</p>
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
              Selected Date: {date ? format(date, 'MMMM d, yyyy') : 'None'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is a simplified calendar page.</p>
            <p className="mt-4">If you can see this calendar, the component is working correctly.</p>
            <Button
              onClick={() => window.location.href = '/calendar'}
              className="mt-4"
            >
              Go to Full Calendar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
