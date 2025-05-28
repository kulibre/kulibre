import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, BarChart2, Users, Clock, FileText, AlertTriangle } from "lucide-react";
import { ProjectProgressChart } from "@/components/dashboard/ProjectProgressChart";
import { TeamWorkloadChart } from "@/components/dashboard/TeamWorkloadChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Import components
import { ActivityTrendChart } from "@/components/analytics/ActivityTrendChart";
import { TaskCompletionCalendar } from "@/components/analytics/TaskCompletionCalendar";
import { TeamPerformanceTable } from "@/components/analytics/TeamPerformanceTable";
import { ProjectStatusTable } from "@/components/analytics/ProjectStatusTable";

// Date Range Picker component
function DateRangePicker({
  from,
  to,
  onSelect,
  className,
}: {
  from: Date;
  to: Date;
  onSelect: (range: DateRange | undefined) => void;
  className?: string;
}) {
  const [date, setDate] = useState<DateRange | undefined>({
    from,
    to,
  });

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-4">
            {/* Replace with your calendar component */}
            <div className="flex gap-2">
              <Button onClick={() => {
                const newFrom = new Date();
                newFrom.setDate(newFrom.getDate() - 7);
                const newRange = { from: newFrom, to: new Date() };
                setDate(newRange);
                onSelect(newRange);
              }}>Last 7 days</Button>
              <Button onClick={() => {
                const newFrom = new Date();
                newFrom.setDate(newFrom.getDate() - 30);
                const newRange = { from: newFrom, to: new Date() };
                setDate(newRange);
                onSelect(newRange);
              }}>Last 30 days</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default function Analytics() {
  const [dateRange, setDateRange] = useState({ from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date() });
  const [selectedProject, setSelectedProject] = useState<string>("all");

  // Fetch user stats
  const { data: userStats, isLoading: isLoadingUserStats } = useQuery({
    queryKey: ['analytics-user-stats', dateRange],
    queryFn: async () => {
      try {
        // If the RPC function doesn't exist yet, use a direct query instead
        const { data: tasksCreated, error: errorCreated } = await supabase
          .from('tasks')
          .select('id')
          .gte('created_at', dateRange.from.toISOString())
          .lte('created_at', dateRange.to.toISOString());
        
        const { data: tasksCompleted, error: errorCompleted } = await supabase
          .from('tasks')
          .select('id')
          .not('completed_at', 'is', null)
          .gte('completed_at', dateRange.from.toISOString())
          .lte('completed_at', dateRange.to.toISOString());
        
        const { data: projects, error: errorProjects } = await supabase
          .from('projects')
          .select('id')
          .eq('status', 'in progress');
        
        if (errorCreated || errorCompleted || errorProjects) throw new Error("Error fetching user stats");
        
        return {
          tasks_created: tasksCreated?.length || 0,
          tasks_completed: tasksCompleted?.length || 0,
          active_projects: projects?.length || 0,
          streak_days: 0 // Streak calculation is not implemented
        };
      } catch (error) {
        console.error("Error fetching user stats:", error);
        return {
          tasks_created: 0,
          tasks_completed: 0,
          active_projects: 0,
          streak_days: 0
        };
      }
    }
  });

  // Fetch project data
  const { data: projectData, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['analytics-projects'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            id, 
            name,
            status,
            start_date,
            due_date,
            tasks:tasks(id, status, completed_at)
          `);
        
        if (error) throw error;
        
        // Process data for chart
        return (data || []).map(project => {
          const totalTasks = project.tasks?.length || 0;
          const completedTasks = project.tasks?.filter(t => t.completed_at !== null).length || 0;
          const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
          
          return {
            id: project.id,
            name: project.name,
            status: project.status,
            totalTasks,
            completedTasks,
            progress,
            startDate: project.start_date,
            dueDate: project.due_date
          };
        });
      } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
      }
    }
  });

  // Fetch team data
  const { data: teamData, isLoading: isLoadingTeam } = useQuery({
    queryKey: ['analytics-team'],
    queryFn: async () => {
      try {
        const { data: teamMembers, error: teamError } = await supabase
          .from('team_members')
          .select('id, full_name, active');
        
        if (teamError) throw teamError;
        
        if (!teamMembers || teamMembers.length === 0) {
          return [];
        }
        
        // For each team member, get their tasks
        const workloadData = await Promise.all(
          teamMembers.map(async (member) => {
            const { data: userTasks, error: userTasksError } = await supabase
              .from('user_tasks')
              .select(`
                task_id,
                tasks:task_id (
                  id,
                  completed_at,
                  created_at
                )
              `)
              .eq('user_id', member.id);
            
            if (userTasksError) {
              console.error("Error fetching user tasks:", userTasksError);
              return {
                id: member.id,
                name: member.full_name || `User ${member.id.substring(0, 4)}`,
                totalTasks: 0,
                completedTasks: 0,
                completionRate: 0,
                active: member.active
              };
            }
            
            const totalTasks = userTasks?.length || 0;
            const completedTasks = userTasks?.filter(ut => ut.tasks?.completed_at !== null).length || 0;
            const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            
            return {
              id: member.id,
              name: member.full_name || `User ${member.id.substring(0, 4)}`,
              totalTasks,
              completedTasks,
              completionRate,
              active: member.active
            };
          })
        );
        
        return workloadData;
      } catch (error) {
        console.error("Error fetching team data:", error);
        return [];
      }
    }
  });

  // Fetch activity trend data
  const { data: activityTrend, isLoading: isLoadingActivityTrend } = useQuery({
    queryKey: ['analytics-activity-trend', dateRange],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('id, created_at, completed_at')
          .gte('created_at', dateRange.from.toISOString())
          .lte('created_at', dateRange.to.toISOString())
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        // Process data for trend chart
        const trendData = [];
        let currentDate = new Date(dateRange.from);
        const endDate = new Date(dateRange.to);
        
        while (currentDate <= endDate) {
          const dateStr = currentDate.toISOString().split('T')[0];
          const tasksCreated = data?.filter(task => 
            task.created_at && task.created_at.startsWith(dateStr)
          ).length || 0;
          
          const tasksCompleted = data?.filter(task => 
            task.completed_at && task.completed_at.startsWith(dateStr)
          ).length || 0;
          
          trendData.push({
            date: dateStr,
            created: tasksCreated,
            completed: tasksCompleted
          });
          
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return trendData;
      } catch (error) {
        console.error("Error fetching activity trend:", error);
        return [];
      }
    }
  });

  // Prepare project chart data
  const projectChartData = projectData?.map(project => ({
    name: project.name,
    value: project.progress,
    color: project.progress < 30 ? "#FEC6A1" : project.progress < 70 ? "#FEF7CD" : "#F2FCE2"
  })) || [];

  // Prepare team workload data for chart
  const teamWorkloadData = teamData?.map(member => ({
    name: member.name,
    tasks: member.totalTasks,
    completed: member.completedTasks,
    max: 10,
    active: member.active
  })) || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Track your productivity and team performance</p>
        </div>
        <div className="flex gap-4 items-center">
          <DateRangePicker
            from={dateRange.from}
            to={dateRange.to}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                setDateRange({ from: range.from, to: range.to });
              }
            }}
          />
          <Button variant="outline">
            Export Data
          </Button>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Tasks Created"
          value={isLoadingUserStats ? "..." : userStats?.tasks_created?.toString() || "0"}
          icon={<FileText className="h-5 w-5" />}
          description="Total tasks"
          trend="neutral"
          trendValue="All time"
        />
        <StatCard
          title="Tasks Completed"
          value={isLoadingUserStats ? "..." : userStats?.tasks_completed?.toString() || "0"}
          icon={<Clock className="h-5 w-5" />}
          description="This period"
          trend="up"
          trendValue="Completed tasks"
          bgColor="bg-kulibre-green/50"
        />
        <StatCard
          title="Active Projects"
          value={isLoadingUserStats ? "..." : userStats?.active_projects?.toString() || "0"}
          icon={<BarChart2 className="h-5 w-5" />}
          description="In progress"
          trend="neutral"
          trendValue="Current projects"
          bgColor="bg-kulibre-blue/50"
        />
        <StatCard
          title="Activity Streak"
          value={isLoadingUserStats ? "..." : userStats?.streak_days?.toString() || "0"}
          icon={<Calendar className="h-5 w-5" />}
          description="Days in a row"
          trend="up"
          trendValue="Keep it up!"
          bgColor="bg-kulibre-orange/50"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Trend</CardTitle>
                <CardDescription>Tasks created vs completed over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoadingActivityTrend ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Loading activity data...</p>
                  </div>
                ) : (
                  <ActivityTrendChart data={activityTrend || []} />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Task Completion Calendar</CardTitle>
                <CardDescription>Daily task completion heatmap</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <TaskCompletionCalendar startDate={dateRange.from} endDate={dateRange.to} />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Project Progress</CardTitle>
                  <CardDescription>Completion status of active projects</CardDescription>
                </div>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Projects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {projectData?.map(project => (
                      <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoadingProjects ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Loading project data...</p>
                  </div>
                ) : (
                  <ProjectProgressChart data={projectChartData} />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Workload</CardTitle>
                <CardDescription>Tasks assigned per team member</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoadingTeam ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Loading team data...</p>
                  </div>
                ) : (
                  <TeamWorkloadChart data={teamWorkloadData} />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Status</CardTitle>
              <CardDescription>Overview of all projects and their progress</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingProjects ? (
                <div className="flex items-center justify-center h-[200px]">
                  <p className="text-muted-foreground">Loading project data...</p>
                </div>
              ) : (
                <ProjectStatusTable projects={projectData || []} />
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
                <CardDescription>Project start and end dates</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {/* Project timeline chart would go here */}
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Project timeline visualization</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Alerts</CardTitle>
                <CardDescription>Projects requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectData?.filter(p => p.progress < 30 && new Date(p.dueDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).map(project => (
                    <div key={project.id} className="flex items-start gap-3 p-3 rounded-md bg-red-50 border border-red-200">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">{project.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Only {project.progress}% complete, due in {Math.ceil((new Date(project.dueDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000))} days
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {(projectData?.filter(p => p.progress < 30 && new Date(p.dueDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length === 0) && (
                    <div className="flex items-center justify-center h-[100px]">
                      <p className="text-muted-foreground">No urgent project alerts</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
              <CardDescription>Task completion rates by team member</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTeam ? (
                <div className="flex items-center justify-center h-[200px]">
                  <p className="text-muted-foreground">Loading team data...</p>
                </div>
              ) : (
                <TeamPerformanceTable teamMembers={teamData || []} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Activity</CardTitle>
              <CardDescription>Recent activity by team members</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Team activity visualization</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


