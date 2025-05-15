import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export default function CalendarStep2() {
  console.log("CalendarStep2 component rendering...");

  try {
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Simple query to test if React Query is working
    const { data, isLoading, error } = useQuery({
      queryKey: ['calendar-test'],
      queryFn: async () => {
        console.log("Executing test query");
        try {
          // Just fetch a single row from profiles to test the connection
          const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name')
            .limit(1);

          if (error) {
            console.error("Supabase query error:", error);
            throw error;
          }

          console.log("Query successful:", data);
          return data || [];
        } catch (err) {
          console.error("Query error:", err);
          return [];
        }
      }
    });

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
                Selected Date: {date ? format(date, 'MMMM d, yyyy') : 'None'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading data...</p>
              ) : error ? (
                <div className="bg-red-50 p-4 rounded-md">
                  <p className="text-red-600">Error loading data</p>
                  <p className="text-sm text-red-500 mt-1">
                    {error instanceof Error ? error.message : 'Unknown error'}
                  </p>
                </div>
              ) : (
                <div>
                  <p>Data loaded successfully!</p>
                  <p className="mt-2">Found {data?.length || 0} profiles.</p>
                  {data && data.length > 0 && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <p>First profile: {data[0].full_name}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in CalendarStep2:", error);
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