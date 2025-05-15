import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export default function TasksPage() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setTasks(data || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast({
          title: 'Error',
          description: 'Failed to load tasks. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [toast]);

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found. Create your first task!</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="p-4">
                <h3 className="font-medium">{task.title}</h3>
                {task.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {task.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Button className="mt-4">Add Task</Button>
    </div>
  );
}
