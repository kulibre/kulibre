import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Simple component to debug the Task page
export default function TasksPageDebug() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  // Fetch tasks directly without react-query
  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching tasks...");
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching tasks:", error);
          setError(error.message);
          toast({
            title: "Error",
            description: `Failed to load tasks: ${error.message}`,
            variant: "destructive",
          });
        } else {
          console.log("Tasks fetched successfully:", data);
          setTasks(data || []);
        }
      } catch (err: any) {
        console.error("Unexpected error:", err);
        setError(err.message || "An unknown error occurred");
        toast({
          title: "Error",
          description: `Unexpected error: ${err.message || "Unknown error"}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [toast]);

  // Simple render function
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Tasks Debug Page</h1>
      
      {loading && <p className="text-blue-500">Loading tasks...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
      
      {!loading && !error && tasks.length === 0 && (
        <p className="text-gray-500">No tasks found. Try creating a new task.</p>
      )}
      
      {!loading && !error && tasks.length > 0 && (
        <div>
          <p className="mb-4 text-green-600">Found {tasks.length} tasks:</p>
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task.id} className="border p-3 rounded">
                <p><strong>Title:</strong> {task.title}</p>
                <p><strong>ID:</strong> {task.id}</p>
                <p><strong>Created:</strong> {new Date(task.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
