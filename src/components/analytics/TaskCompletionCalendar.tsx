import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TaskCompletionCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // TODO: Replace with actual task completion data
  const completedDates = [
    new Date(2024, 2, 1),
    new Date(2024, 2, 5),
    new Date(2024, 2, 10),
    new Date(2024, 2, 15),
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Task Completion Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          modifiers={{
            completed: completedDates,
          }}
          modifiersStyles={{
            completed: {
              backgroundColor: '#22c55e',
              color: 'white',
              borderRadius: '50%',
            },
          }}
        />
      </CardContent>
    </Card>
  );
} 