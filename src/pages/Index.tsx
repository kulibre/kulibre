
import { Clock, CheckSquare, AlertTriangle, FolderKanban, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { TeamWorkloadChart } from "@/components/dashboard/TeamWorkloadChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/lib/activity-logger";


export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  // Fetch tasks due today
  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['dashboard-tasks'],
    queryFn: async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data, error } = await supabase
          .from('tasks')
          .select(`
            *,
            project:project_id (id, name)
          `)
          .is('completed_at', null)
          .gte('due_date', today.toISOString())
          .lt('due_date', new Date(today.getTime() + 86400000).toISOString()) // +1 day
          .order('due_date', { ascending: true })
          .limit(5);

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }
    }
  });

  // Fetch active tasks count
  const { data: activeTasks, isLoading: isLoadingActiveTasks } = useQuery({
    queryKey: ['dashboard-active-tasks-count'],
    queryFn: async () => {
      try {
        const { count, error } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .is('completed_at', null);

        if (error) throw error;
        return count || 0;
      } catch (error) {
        console.error("Error fetching active tasks count:", error);
        throw error;
      }
    }
  });

  // Fetch completed tasks count
  const { data: completedTasksCount, isLoading: isLoadingCompletedTasks } = useQuery({
    queryKey: ['dashboard-completed-tasks-count'],
    queryFn: async () => {
      try {
        // Get date for 7 days ago
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);

        const { count, error } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .not('completed_at', 'is', null)
          .gte('completed_at', lastWeek.toISOString());

        if (error) throw error;
        return count || 0;
      } catch (error) {
        console.error("Error fetching completed tasks count:", error);
        throw error;
      }
    }
  });

  // Fetch high priority tasks count
  const { data: highPriorityTasks, isLoading: isLoadingHighPriorityTasks } = useQuery({
    queryKey: ['dashboard-high-priority-tasks'],
    queryFn: async () => {
      try {
        const { count, error } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .is('completed_at', null)
          .eq('priority', 'high');

        if (error) throw error;
        return count || 0;
      } catch (error) {
        console.error("Error fetching high priority tasks:", error);
        throw error;
      }
    }
  });

  // Fetch team workload data
  const { data: teamWorkload, isLoading: isLoadingTeamWorkload } = useQuery({
    queryKey: ['dashboard-team-workload'],
    queryFn: async () => {
      try {
        // Get all team members (both active and inactive)
        const { data: teamMembers, error: teamError } = await supabase
          .from('team_members')
          .select('id, full_name, active')
          .order('full_name')
          .limit(10);

        if (teamError) throw teamError;

        if (!teamMembers || teamMembers.length === 0) {
          // If no team members, create sample data for demonstration
          return [
            { name: "Sample User 1", tasks: 5, completed: 2, max: 10 },
            { name: "Sample User 2", tasks: 8, completed: 3, max: 10 },
            { name: "Sample User 3", tasks: 3, completed: 1, max: 10 }
          ];
        }

        // For each team member, get all their tasks
        const workloadData = await Promise.all(
          teamMembers.map(async (member) => {
            // Get all tasks assigned to this user
            const { data: userTasks, error: userTasksError } = await supabase
              .from('user_tasks')
              .select(`
                task_id,
                tasks:task_id (
                  id,
                  completed_at
                )
              `)
              .eq('user_id', member.id);

            if (userTasksError) {
              console.error("Error fetching user tasks:", userTasksError);
              return {
                name: member.full_name || `User ${member.id.substring(0, 4)}`,
                tasks: 0,
                completed: 0,
                max: 10,
                active: member.active
              };
            }

            if (!userTasks || userTasks.length === 0) {
              return {
                name: member.full_name || `User ${member.id.substring(0, 4)}`,
                tasks: 0,
                completed: 0,
                max: 10,
                active: member.active
              };
            }

            // Count total tasks and completed tasks
            const totalTasks = userTasks.length;
            const completedTasks = userTasks.filter(ut => ut.tasks?.completed_at !== null).length;

            return {
              name: member.full_name || `User ${member.id.substring(0, 4)}`,
              tasks: totalTasks,
              completed: completedTasks,
              max: 10, // Default max tasks per person
              active: member.active
            };
          })
        );

        // If all real data is empty, add sample data
        if (workloadData.every(item => item.tasks === 0)) {
          return [
            { name: "Sample User 1", tasks: 5, completed: 2, max: 10 },
            { name: "Sample User 2", tasks: 8, completed: 3, max: 10 },
            { name: "Sample User 3", tasks: 3, completed: 1, max: 10 }
          ];
        }

        return workloadData;
      } catch (error) {
        console.error("Error fetching team workload:", error);
        // Return sample data if there's an error
        return [
          { name: "Sample User 1", tasks: 5, completed: 2, max: 10 },
          { name: "Sample User 2", tasks: 8, completed: 3, max: 10 },
          { name: "Sample User 3", tasks: 3, completed: 1, max: 10 }
        ];
      }
    }
  });

  // Fetch recent activity
  const { data: recentActivity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['dashboard-recent-activity'],
    queryFn: async () => {
      try {
        // Check if activity_logs table exists
        const { error: tableCheckError } = await supabase
          .from('activity_logs')
          .select('id')
          .limit(1);

        // If table doesn't exist, return empty array
        if (tableCheckError) {
          console.log("Activity logs table may not exist:", tableCheckError);
          return [];
        }

        // Fetch activity logs with user information
        const { data, error } = await supabase
          .from('activity_logs')
          .select(`
            *,
            user:user_id (
              id,
              full_name
            )
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching recent activity:", error);
        return [];
      }
    }
  });

  // Get current user
  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    }
  });

  // Mutation to mark task as completed
  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      // Get task details first for the activity log
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          project:project_id (id, name)
        `)
        .eq('id', taskId)
        .single();

      if (taskError) throw taskError;

      // Update the task
      const { data, error } = await supabase
        .from('tasks')
        .update({ completed_at: new Date().toISOString() })
        .eq('id', taskId)
        .select();

      if (error) throw error;

      // Log the activity if we have a user
      if (currentUser && taskData) {
        await logActivity({
          userId: currentUser.id,
          actionType: 'task_completed',
          entityType: 'task',
          entityId: taskId,
          description: `Completed task "${taskData.title}"`,
          metadata: {
            project_id: taskData.project?.id,
            project_name: taskData.project?.name,
          }
        });
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: "Task completed",
        description: "The task has been marked as completed.",
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['dashboard-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-active-tasks-count'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-completed-tasks-count'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-recent-activity'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      });
      console.error("Error completing task:", error);
    }
  });

  const toggleTaskCompletion = (taskId: string) => {
    // First update local state for immediate UI feedback
    setCompletedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );

    // Then update the database
    completeTaskMutation.mutate(taskId);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back to kulibre</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/tasks">View All Tasks</Link>
          </Button>
          <Button asChild>
            <Link to="/projects">My Projects</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Tasks"
          value={isLoadingActiveTasks ? "..." : activeTasks?.toString() || "0"}
          icon={<FolderKanban className="h-5 w-5" />}
          description="In progress"
          trend="up"
          trendValue={`${isLoadingActiveTasks ? "Loading..." : "Updated just now"}`}
        />
        <StatCard
          title="Tasks Due Today"
          value={isLoadingTasks ? "..." : tasks?.length.toString() || "0"}
          icon={<Clock className="h-5 w-5" />}
          description={`${isLoadingHighPriorityTasks ? "..." : highPriorityTasks} high priority`}
          trend="neutral"
          trendValue="Due today"
          bgColor="bg-kulibre-yellow/50"
        />
        <StatCard
          title="Completed Tasks"
          value={isLoadingCompletedTasks ? "..." : completedTasksCount?.toString() || "0"}
          icon={<CheckSquare className="h-5 w-5" />}
          description="This week"
          trend="up"
          trendValue="Completed tasks"
          bgColor="bg-kulibre-green/50"
        />
        <StatCard
          title="Team Members"
          value={isLoadingTeamWorkload ? "..." : teamWorkload?.length.toString() || "0"}
          icon={<AlertTriangle className="h-5 w-5" />}
          description="Active members"
          trend="neutral"
          trendValue="Team status"
          bgColor="bg-kulibre-orange/50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>

            <ActivityFeed
              activities={recentActivity || []}
              isLoading={isLoadingActivity}
            />
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tasks Due Today</CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/tasks">See All Tasks</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/tasks?action=add">Add Task</Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoadingTasks ? (
                <>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3 p-3 border rounded-md">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-3/4 mb-1" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </>
              ) : tasks && tasks.length > 0 ? (
                <>
                  {tasks.map(task => (
                    <TaskCard
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      project={task.project?.name || "No Project"}
                      projectId={task.project_id}
                      dueTime={task.due_date ? new Date(task.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Today"}
                      priority={(task.priority === "high" || task.priority === "medium" || task.priority === "low") ? task.priority : "medium"}
                      completed={completedTasks.includes(task.id)}
                      onClick={() => toggleTaskCompletion(task.id)}
                      showViewButton={true}
                    />
                  ))}
                </>
              ) : (
                <p className="text-center text-muted-foreground py-4">No tasks due today. Enjoy your day!</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Workload</CardTitle>
              <CardDescription>Tasks assigned per team member (total and completed)</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoadingTeamWorkload ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Loading team workload data...</p>
                </div>
              ) : (
                <TeamWorkloadChart data={teamWorkload || []} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
