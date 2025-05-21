import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActivityTrendChart } from "@/components/analytics/ActivityTrendChart";
import { TaskCompletionCalendar } from "@/components/analytics/TaskCompletionCalendar";
import { TeamPerformanceTable } from "@/components/analytics/TeamPerformanceTable";
import { ProjectStatusTable } from "@/components/analytics/ProjectStatusTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
// import additional chart components from recharts as needed

export default function Analytics() {
  // Date helpers
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  // 1. User Overview Section
  const { data: totalTasks, isLoading: loadingTotalTasks } = useQuery({
    queryKey: ["analytics-total-tasks"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: completedThisWeek, isLoading: loadingCompletedThisWeek } = useQuery({
    queryKey: ["analytics-completed-this-week"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .not("completed_at", "is", null)
        .gte("completed_at", sevenDaysAgo.toISOString());
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: activeProjects, isLoading: loadingActiveProjects } = useQuery({
    queryKey: ["analytics-active-projects"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .not("status", "in", "(completed,archived)");
      if (error) throw error;
      return count || 0;
    },
  });

  // 2. Project Summary Section
  const { data: projects, isLoading: loadingProjects } = useQuery({
    queryKey: ["analytics-projects"],
    queryFn: async () => {
      // Get all projects
      const { data: projects, error } = await supabase
        .from("projects")
        .select("id, name, status, start_date, due_date");
      if (error) throw error;
      if (!projects) return [];
      // For each project, get total/completed tasks
      const projectIds = projects.map((p) => p.id);
      if (projectIds.length === 0) return [];
      // Get all tasks for these projects
      const { data: tasks, error: taskError } = await supabase
        .from("tasks")
        .select("id, project_id, completed_at");
      if (taskError) throw taskError;
      // Aggregate
      return projects.map((project) => {
        const projectTasks = tasks?.filter((t) => t.project_id === project.id) || [];
        const completedTasks = projectTasks.filter((t) => t.completed_at).length;
        const totalTasks = projectTasks.length;
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        return {
          id: project.id,
          name: project.name,
          status: project.status,
          startDate: project.start_date,
          dueDate: project.due_date,
          totalTasks,
          completedTasks,
          progress,
        };
      });
    },
  });

  // 3. Team Insights Section
  const { data: teamMembers, isLoading: loadingTeamMembers } = useQuery({
    queryKey: ["analytics-team-members"],
    queryFn: async () => {
      // Get all users (profiles)
      const { data: users, error } = await supabase
        .from("profiles")
        .select("id, full_name");
      if (error) throw error;
      if (!users) return [];
      // Get all tasks
      const { data: tasks, error: taskError } = await supabase
        .from("tasks")
        .select("id, assigned_to, completed_at");
      if (taskError) throw taskError;
      // Aggregate
      return users.map((user) => {
        const userTasks = tasks?.filter((t) => t.assigned_to === user.id) || [];
        const completedTasks = userTasks.filter((t) => t.completed_at).length;
        const totalTasks = userTasks.length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        return {
          id: user.id,
          name: user.full_name || "Unnamed",
          totalTasks,
          completedTasks,
          completionRate,
          active: true, // No active field in profiles, always true
        };
      });
    },
  });

  // 4. Activity Trend Chart (last 30 days)
  const { data: activityData, isLoading: loadingActivityData } = useQuery({
    queryKey: ["analytics-activity-trend", thirtyDaysAgo, today],
    queryFn: async () => {
      // Get all tasks created and completed in the last 30 days
      const { data: tasks, error } = await supabase
        .from("tasks")
        .select("created_at, completed_at");
      if (error) throw error;
      // Build date buckets
      const buckets: Record<string, { created: number; completed: number }> = {};
      for (let i = 0; i <= 30; i++) {
        const d = new Date(thirtyDaysAgo);
        d.setDate(d.getDate() + i);
        const key = d.toISOString().split("T")[0];
        buckets[key] = { created: 0, completed: 0 };
      }
      tasks?.forEach((task) => {
        if (task.created_at) {
          const date = task.created_at.split("T")[0];
          if (buckets[date]) buckets[date].created++;
        }
        if (task.completed_at) {
          const date = task.completed_at.split("T")[0];
          if (buckets[date]) buckets[date].completed++;
        }
      });
      return Object.entries(buckets).map(([date, { created, completed }]) => ({ date, created, completed }));
    },
  });

  // 5. Streaks (optional, simple: max consecutive days with completed tasks)
  const { data: streak, isLoading: loadingStreak } = useQuery({
    queryKey: ["analytics-streak", thirtyDaysAgo, today],
    queryFn: async () => {
      const { data: tasks, error } = await supabase
        .from("tasks")
        .select("completed_at")
        .not("completed_at", "is", null)
        .gte("completed_at", thirtyDaysAgo.toISOString())
        .lte("completed_at", today.toISOString());
      if (error) throw error;
      // Build a set of days with completions
      const days = new Set(
        (tasks || []).map((t) => t.completed_at && t.completed_at.split("T")[0]).filter(Boolean)
      );
      // Calculate max streak
      let maxStreak = 0;
      let currentStreak = 0;
      for (let i = 0; i <= 30; i++) {
        const d = new Date(thirtyDaysAgo);
        d.setDate(d.getDate() + i);
        const key = d.toISOString().split("T")[0];
        if (days.has(key)) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }
      return maxStreak;
    },
  });

  // Loading state
  const isLoading =
    loadingTotalTasks ||
    loadingCompletedThisWeek ||
    loadingActiveProjects ||
    loadingProjects ||
    loadingTeamMembers ||
    loadingActivityData ||
    loadingStreak;

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex gap-2">
          {/* TODO: Add filter dropdowns */}
          <Button variant="outline">Export CSV</Button>
          <Button variant="outline">Export PDF</Button>
        </div>
      </div>

      {/* User Overview Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">User Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            {loadingTotalTasks ? "..." : totalTasks}
            <div className="text-xs text-muted-foreground">Total Tasks Created</div>
          </Card>
          <Card className="p-4">
            {loadingCompletedThisWeek ? "..." : completedThisWeek}
            <div className="text-xs text-muted-foreground">Tasks Completed This Week</div>
          </Card>
          <Card className="p-4">
            {loadingActiveProjects ? "..." : activeProjects}
            <div className="text-xs text-muted-foreground">Active Projects</div>
          </Card>
          <Card className="p-4">
            {loadingStreak ? "..." : streak}
            <div className="text-xs text-muted-foreground">Streak (days)</div>
          </Card>
        </div>
      </section>

      {/* Project Summary Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Project Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <ProjectStatusTable projects={projects || []} />
          </Card>
          <Card className="p-4">Most Active Project{/* TODO: Show details */}</Card>
        </div>
      </section>

      {/* Team Insights Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Team Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <TeamPerformanceTable teamMembers={teamMembers || []} />
          </Card>
          <Card className="p-4">Activity Heatmap{/* TODO: Add heatmap/bar chart */}</Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Card className="p-4">Bottlenecks{/* TODO: Overdue tasks, blockers */}</Card>
          <Card className="p-4">Top Contributors{/* TODO: List or chart */}</Card>
        </div>
      </section>

      {/* Time-Based Charts Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Productivity Trends</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <ActivityTrendChart data={activityData || []} />
          </Card>
          <Card className="p-4">
            <TaskCompletionCalendar startDate={thirtyDaysAgo} endDate={today} />
          </Card>
        </div>
      </section>

      {/* Notifications / Alerts Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Notifications & Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">Projects Approaching Deadlines{/* TODO: List */}</Card>
          <Card className="p-4">Overdue Tasks{/* TODO: List */}</Card>
          <Card className="p-4">Tasks With No Assignee{/* TODO: List */}</Card>
        </div>
      </section>

      {/* Billing Section (Optional) */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Billing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">Current Plan{/* TODO: Show plan */}</Card>
          <Card className="p-4">Billing History{/* TODO: Show history, upgrade/downgrade */}</Card>
        </div>
      </section>
    </div>
  );
}