import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, eachDayOfInterval, isSameDay } from "date-fns";

interface TaskCompletionCalendarProps {
  startDate: Date;
  endDate: Date;
}

interface CompletionData {
  date: string;
  count: number;
}

export function TaskCompletionCalendar({ startDate, endDate }: TaskCompletionCalendarProps) {
  // Fetch task completion data
  const { data: completionData, isLoading } = useQuery({
    queryKey: ['task-completion-calendar', startDate, endDate],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('completed_at')
          .not('completed_at', 'is', null)
          .gte('completed_at', startDate.toISOString())
          .lte('completed_at', endDate.toISOString());
        
        if (error) throw error;
        
        // Group by date and count
        const counts: Record<string, number> = {};
        
        data?.forEach(task => {
          if (task.completed_at) {
            const dateStr = task.completed_at.split('T')[0];
            counts[dateStr] = (counts[dateStr] || 0) + 1;
          }
        });
        
        return Object.entries(counts).map(([date, count]) => ({
          date,
          count
        }));
      } catch (error) {
        console.error("Error fetching task completion data:", error);
        return [];
      }
    }
  });

  // Generate all days in the range
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Get color intensity based on count
  const getColorIntensity = (count: number) => {
    if (count === 0) return "bg-gray-100";
    if (count <= 2) return "bg-green-100";
    if (count <= 5) return "bg-green-200";
    if (count <= 10) return "bg-green-300";
    return "bg-green-400";
  };

  // Find count for a specific day
  const getCountForDay = (day: Date): number => {
    if (!completionData) return 0;
    const dateStr = format(day, 'yyyy-MM-dd');
    const found = completionData.find(d => d.date === dateStr);
    return found ? found.count : 0;
  };

  return (
    <div className="w-full h-full">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading calendar data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-xs text-center font-medium py-1">
              {day}
            </div>
          ))}
          
          {allDays.map(day => {
            const count = getCountForDay(day);
            return (
              <div
                key={day.toISOString()}
                className={`aspect-square rounded-md flex flex-col items-center justify-center ${getColorIntensity(count)}`}
                title={`${format(day, 'MMM dd')}: ${count} tasks completed`}
              >
                <span className="text-xs">{format(day, 'd')}</span>
                {count > 0 && (
                  <span className="text-[10px] font-medium">{count}</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}