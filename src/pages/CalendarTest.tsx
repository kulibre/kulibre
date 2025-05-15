import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default function CalendarTest() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">Calendar Test</h1>
        <p className="text-muted-foreground mt-1">Testing the calendar component</p>
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
            <p>This is a test calendar page with just the date picker.</p>
            <p className="mt-4">If you can see this calendar, the component is working correctly.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
