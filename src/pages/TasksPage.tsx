import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import {
  CheckCircle2,
  Circle,
  Filter,
  Plus,
  Search,
  Trash2,
  Edit,
  MoreHorizontal,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";

// Define Task type
interface Task {
  id: string;
  title: string;
  project_id: string | null;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  // These fields are not in the database but used in the UI
  description?: string;
  status: "todo" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  updated_at?: string;
  project?: {
    id: string;
    name: string;
  };
  assigned_users: User[];
}

// Define User type
interface User {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

// Define Project type
interface Project {
  id: string;
  name: string;
}

// Define database response type
interface TaskResponse {
  id: string;
  title: string;
  project_id: string;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  description: string | null;
  updated_at: string | null;
  projects: {
    id: string;
    name: string;
  } | null;
  user_tasks: Array<{
    team_members: {
      id: string;
      full_name: string;
      avatar_url: string | null;
    } | null;
  }>;
}

// Define database response types
interface TeamMember {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

interface UserTaskAssignment {
  task_id: string;
  user_id: string;
  team_members: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

// Define database response types
interface UserTaskWithTeamMember {
  task_id: string;
  user_id: string;
  team_members: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

interface SupabaseResponse<T> {
  data: T | null;
  error: any;
}

export default function TasksPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    project_id: "none",
    status: "todo",
    priority: "medium",
    assigned_users: [] as User[],
    due_date: null as Date | null
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [projectFilter, setProjectFilter] = useState<string | null>(null);
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);

  // Get parameters from URL if present
  const searchParams = new URLSearchParams(window.location.search);
  const taskIdFromUrl = searchParams.get('id');
  const actionFromUrl = searchParams.get('action');

  // Fetch tasks with user assignments
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      try {
        console.log("Fetching tasks with assignments...");
        
        // First fetch tasks with their projects
        const { data: taskData, error: taskError } = await supabase
          .from('tasks')
          .select(`
            *,
            projects:project_id (
              id,
              name
            )
          `)
          .order('created_at', { ascending: false });

        if (taskError) {
          console.error("Error fetching tasks:", taskError);
          throw taskError;
        }

        // Then fetch all user assignments with team member details
        const { data: userAssignments, error: assignmentsError }: SupabaseResponse<UserTaskWithTeamMember[]> = await supabase
          .from('user_tasks')
          .select(`
            task_id,
            user_id,
            team_members!inner (
              id,
              full_name,
              avatar_url
            )
          `);

        if (assignmentsError) {
          console.error("Error fetching user assignments:", assignmentsError);
          throw assignmentsError;
        }

        // Create a map of task IDs to their assigned users
        const taskAssignmentsMap = new Map<string, User[]>();
        
        if (userAssignments) {
          userAssignments.forEach(assignment => {
            const user: User = {
              id: assignment.team_members.id,
              full_name: assignment.team_members.full_name,
              avatar_url: assignment.team_members.avatar_url
            };

            const existingUsers = taskAssignmentsMap.get(assignment.task_id) || [];
            taskAssignmentsMap.set(assignment.task_id, [...existingUsers, user]);
          });
        }

        // Convert database tasks to our Task interface
        const convertedTasks: Task[] = (taskData || []).map(task => {
          const assignedUsers = taskAssignmentsMap.get(task.id) || [];
          console.log(`Task ${task.id} assigned users:`, assignedUsers);

          return {
            id: task.id,
            title: task.title,
            project_id: task.project_id,
            due_date: task.due_date,
            completed_at: task.completed_at,
            created_at: task.created_at,
            description: task.description,
            updated_at: task.updated_at,
            project: task.projects,
            assigned_users: assignedUsers,
            status: (task.completed_at ? 'completed' : 'todo') as "todo" | "in_progress" | "completed",
            priority: 'medium' as "low" | "medium" | "high"
          };
        });

        console.log("Converted tasks:", convertedTasks);
        return convertedTasks;
      } catch (error: any) {
        console.error("Error in task query:", error);
        toast({
          title: "Error",
          description: `Failed to load tasks: ${error.message}`,
          variant: "destructive",
        });
        return [] as Task[];
      }
    }
  });

  // Fetch projects
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name')
          .order('name');

        if (error) throw error;
        return data as Project[];
      } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
      }
    }
  });

  // Fetch projects for dropdown
  const { data: projectsForTasks } = useQuery({
    queryKey: ['projects-for-tasks'],
    retry: 2, // Retry failed requests 2 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000), // Exponential backoff
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name')
          .order('name');

        if (error) {
          console.error("Error fetching projects:", error);
          throw error;
        }

        return data as Project[];
      } catch (error) {
        console.error("Unexpected error fetching projects:", error);
        // Return empty array instead of failing
        return [] as Project[];
      }
    }
  });

  // FINAL FIXED VERSION - Hardcoded team members to ensure they always show up
  const { data: users } = useQuery({
    queryKey: ['users-for-tasks'],
    queryFn: async () => {
      // Try to fetch from team_members first, then profiles for fallback
      const { data: teamMembers, error: teamError } = await supabase
        .from('team_members')
        .select('id, full_name, avatar_url')
        .order('full_name');
      let usersList = teamMembers || [];
      if (teamError || usersList.length === 0) {
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .order('full_name');
        if (!profileError && profiles) {
          usersList = profiles;
        }
      }
      return usersList as User[];
    }
  });

  // Debug log for users data
  useEffect(() => {
    if (users) {
      console.log("Available team members for task assignment:", users.map(u => `${u.id} (${u.full_name})`));
    }
  }, [users]);

  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: async (task: typeof newTask) => {
      try {
        console.log("Starting task creation with:", task);

        // Map assigned_users to user IDs
        const assignedUserIds = Array.isArray(task.assigned_users)
          ? task.assigned_users.map(u => typeof u === 'string' ? u : u.id)
          : [];

        console.log("Team members to assign:", assignedUserIds);

        // First, insert the task
        const { data: newTaskData, error: taskError } = await supabase
          .from('tasks')
          .insert([{
            title: task.title,
            project_id: task.project_id && task.project_id !== "none" ? task.project_id : null,
            due_date: task.due_date ? format(task.due_date, 'yyyy-MM-dd') : null,
            completed_at: task.status === 'completed' ? new Date().toISOString() : null
          }])
          .select()
          .single();

        if (taskError || !newTaskData) {
          console.error("Error inserting task:", taskError);
          throw taskError || new Error("Failed to create task");
        }

        console.log("Task created successfully:", newTaskData);

        // If we have assigned users, create user_task entries
        if (assignedUserIds.length > 0) {
          const userTaskEntries = assignedUserIds.map(userId => ({
            task_id: newTaskData.id,
            user_id: userId
          }));

          const { error: assignmentError } = await supabase
            .from('user_tasks')
            .insert(userTaskEntries);

          if (assignmentError) {
            console.error("Error assigning users to task:", assignmentError);
            // Don't throw here, as the task was created successfully
          }
        }

        return newTaskData;
      } catch (error) {
        console.error("Unexpected error in task creation:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task added",
        description: "The task has been added successfully.",
      });
      setIsAddTaskOpen(false);
      resetNewTaskForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error adding task",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async (task: Task) => {
      try {
        console.log("Update task mutation called with task:", task);
        console.log("Assigned users in update mutation:", task.assigned_users);
        
        // Map assigned_users to user IDs
        const assignedUserIds = Array.isArray(task.assigned_users)
          ? task.assigned_users.map(u => u.id)
          : [];
        
        console.log("Mapped assigned user IDs:", assignedUserIds);

        // First, update the task
        const { data: updatedTask, error: taskError } = await supabase
          .from('tasks')
          .update({
            title: task.title,
            project_id: task.project_id && task.project_id !== "none" ? task.project_id : null,
            due_date: task.due_date,
            completed_at: task.status === 'completed' ? new Date().toISOString() : null
          })
          .eq('id', task.id)
          .select()
          .single();

        if (taskError || !updatedTask) {
          console.error("Error updating task:", taskError);
          throw taskError || new Error("Failed to update task");
        }

        // Delete existing assignments
        const { error: deleteError } = await supabase
          .from('user_tasks')
          .delete()
          .eq('task_id', task.id);

        if (deleteError) {
          console.error("Error deleting existing assignments:", deleteError);
        }

        // Add new assignments if there are any
        if (assignedUserIds.length > 0) {
          const userTaskEntries = assignedUserIds.map(userId => ({
            task_id: task.id,
            user_id: userId
          }));

          const { error: assignmentError } = await supabase
            .from('user_tasks')
            .insert(userTaskEntries);

          if (assignmentError) {
            console.error("Error updating task assignments:", assignmentError);
          }
        }

        return updatedTask;
      } catch (error) {
        console.error("Unexpected error in task update:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task updated",
        description: "The task has been updated successfully.",
      });
      setIsEditTaskOpen(false);
      setCurrentTask(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      // First check if the user_tasks table exists
      const { error: tableCheckError } = await supabase
        .from('user_tasks')
        .select('id')
        .limit(1);

      if (!tableCheckError) {
        // Only try to delete user task assignments if the table exists
        const { error: userTaskError } = await supabase
          .from('user_tasks')
          .delete()
          .eq('task_id', taskId);

        if (userTaskError) {
          console.error("Error deleting user task assignments:", userTaskError);
          // Continue with task deletion even if user_tasks deletion fails
        }
      }

      // Then delete the task
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Toggle task status mutation
  const toggleTaskStatusMutation = useMutation({
    mutationFn: async (task: Task) => {
      try {
        const newStatus = task.completed_at ? null : new Date().toISOString();
        console.log(`Toggling task status for task ${task.id} to ${newStatus ? 'completed' : 'todo'}`);

        const { error } = await supabase
          .from('tasks')
          .update({
            completed_at: newStatus
          })
          .eq('id', task.id);

        if (error) {
          console.error("Error toggling task status:", error);
          throw error;
        }

        return { taskId: task.id, newStatus };
      } catch (error) {
        console.error("Unexpected error in task status toggle:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating task status",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  });

  // Reset new task form
  const resetNewTaskForm = () => {
    setNewTask({
      title: "",
      description: "",
      project_id: "none",
      status: "todo",
      priority: "medium",
      assigned_users: [],
      due_date: null
    });
  };

  // Handle edit task
  const handleEditTask = (task: Task) => {
    if (!task) {
      console.error("Cannot edit task: Invalid task");
      return;
    }

    try {
      console.log("Opening edit dialog for task:", task);
      console.log("Assigned users:", task.assigned_users);

      // Convert assigned_users to proper User objects if they're just IDs
      let processedAssignedUsers: User[] = [];
      
      if (Array.isArray(task.assigned_users)) {
        // If assigned_users contains string IDs, convert to User objects
        if (task.assigned_users.length > 0 && typeof task.assigned_users[0] === 'string') {
          processedAssignedUsers = users?.filter(user => 
            task.assigned_users.includes(user.id)
          ) || [];
        } else {
          // If already User objects, use them directly
          processedAssignedUsers = [...task.assigned_users.map(user => ({...user}))];
        }
      }

      // Make sure we have the assigned_users array and all required fields
      const taskToEdit: Task = {
        ...task,
        assigned_users: processedAssignedUsers,
        status: (task.completed_at ? 'completed' : 'todo') as "todo" | "in_progress" | "completed",
        priority: (task.priority || 'medium') as "low" | "medium" | "high"
      };

      console.log("Prepared task for editing:", taskToEdit);
      console.log("Assigned users after preparation:", taskToEdit.assigned_users);

      setCurrentTask(taskToEdit);
      setIsEditTaskOpen(true);
    } catch (error) {
      console.error("Error in handleEditTask:", error);
      toast({
        title: "Error",
        description: "Could not edit task. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle task status toggle
  const handleToggleStatus = (task: Task) => {
    if (!task || !task.id) {
      console.error("Cannot toggle status: Invalid task or missing ID");
      return;
    }

    console.log(`Toggling status for task: ${task.id} (${task.title})`);
    toggleTaskStatusMutation.mutate(task);
  };

  // Format date for display
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'No due date';
    try {
      // Handle both string dates and Date objects
      const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error("Invalid date:", dateString);
      return 'Invalid date';
    }
  };

  // Render tasks list with full functionality
  const renderTasksList = (tasksList: Task[]) => {
    if (isLoading) {
      return <div className="py-8 text-center text-muted-foreground">Loading tasks...</div>;
    }

    if (error) {
      return <div className="py-8 text-center text-muted-foreground">Error loading tasks. Please try again.</div>;
    }

    if (!tasksList || tasksList.length === 0) {
      return <div className="py-8 text-center text-muted-foreground">No tasks found. Get started by creating a new task.</div>;
    }

    return (
      <div className="space-y-4">
        {tasksList.map((task) => (
          <Card key={task.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => handleToggleStatus(task)}
                  className="mt-1 focus:outline-none"
                  aria-label={task.completed_at ? "Mark as incomplete" : "Mark as complete"}
                >
                  {getStatusIcon(task.completed_at ? 'completed' : 'todo')}
                </button>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium">{task.title}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditTask(task)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this task?")) {
                              deleteTaskMutation.mutate(task.id);
                            }
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {task.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {task.project && task.project.name && (
                      <Badge variant="outline" className="bg-blue-50">
                        {task.project.name}
                      </Badge>
                    )}
                    {task.priority && (
                      <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    )}
                    {task.due_date && (
                      <Badge variant="outline">
                        Due: {formatDate(task.due_date)}
                      </Badge>
                    )}
                  </div>
                  {task.assigned_users && task.assigned_users.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {task.assigned_users.map(user => (
                        <Badge key={user.id} variant="secondary" className="bg-gray-100 text-gray-800">
                          {user.full_name || 'Unnamed User'}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Simplified effect to handle URL parameters
  useEffect(() => {
    console.log("URL parameters effect running");
    // Open add task dialog when action=add is in URL
    if (actionFromUrl === 'add') {
      setIsAddTaskOpen(true);
    }
  }, [actionFromUrl]);

  // Simplified effect for handling task ID
  useEffect(() => {
    console.log("Task ID effect running");
    // Open task edit dialog when task ID is in URL
    if (taskIdFromUrl && tasks && tasks.length > 0) {
      const task = tasks.find(task => task.id === taskIdFromUrl);
      if (task) {
        // Make sure we have the assigned_users array and all required fields
        // Create a deep copy to ensure we don't have reference issues
        const taskToEdit: Task = {
          ...task,
          assigned_users: Array.isArray(task.assigned_users) 
            ? [...task.assigned_users.map(user => ({...user}))] 
            : [],
          status: (task.completed_at ? 'completed' : 'todo') as "todo" | "in_progress" | "completed",
          priority: (task.priority || 'medium') as "low" | "medium" | "high"
        };
        
        console.log("Opening task from URL with assigned users:", taskToEdit.assigned_users);
        setCurrentTask(taskToEdit);
        setIsEditTaskOpen(true);
      }
    }
  }, [taskIdFromUrl, tasks]);

  // Get priority badge color
  const getPriorityColor = (priority: string | undefined) => {
    if (!priority) {
      return "bg-gray-100 text-gray-800";
    }

    const colors: Record<string, string> = {
      high: "bg-red-100 text-red-800",
      medium: "bg-amber-100 text-amber-800",
      low: "bg-green-100 text-green-800"
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    if (status === 'completed') {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    } else {
      return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  // Filter tasks by status for tabs
  let completedTasks = [];
  let todoTasks = [];

  try {
    if (Array.isArray(tasks)) {
      completedTasks = tasks.filter(task => task && task.completed_at !== null) || [];
      todoTasks = tasks.filter(task => task && task.completed_at === null) || [];
    }
  } catch (error) {
    console.error("Error filtering tasks:", error);
    // Use empty arrays as fallback
  }

  return (
    <div className="space-y-8">
      {/* DEBUG OUTPUT - Only show in development mode */}
      {process.env.NODE_ENV !== 'production' && (
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: 8 }}>DEBUG INFO</h3>
          <div style={{ marginBottom: 8 }}>
            <strong>Users fetched:</strong>
            <ul style={{ fontSize: 12 }}>
              {(users || []).map(u => (
                <li key={u.id}>{u.id} - {u.full_name}</li>
              ))}
            </ul>
          </div>
          <div style={{ marginBottom: 8 }}>
            <strong>Tasks assignments (from user_tasks):</strong>
            <ul style={{ fontSize: 12 }}>
              {(tasks || []).map(task => (
                <li key={task.id}>
                  Task {task.id}: assigned_users IDs: [
                  {(task.assigned_users || []).map(u => u.id).join(', ') || 'None'}
                  ]
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Tasks assignments (names):</strong>
            <ul style={{ fontSize: 12 }}>
              {(tasks || []).map(task => (
                <li key={task.id}>
                  Task {task.id}: assigned_users: [
                  {(task.assigned_users || []).map(u => u.full_name).join(', ') || 'None'}
                  ]
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div>
        <h1 className="text-3xl font-bold">Tasks</h1>
        <p className="text-muted-foreground mt-1">Manage your tasks and track progress</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={statusFilter || "all"}
                    onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={priorityFilter || "all"}
                    onValueChange={(value) => setPriorityFilter(value === "all" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All priorities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Project</Label>
                  <Select
                    value={projectFilter || "all"}
                    onValueChange={(value) => setProjectFilter(value === "all" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All projects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All projects</SelectItem>
                      {projectsForTasks?.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Assignee</Label>
                  <Select
                    value={assigneeFilter || "all"}
                    onValueChange={(value) => setAssigneeFilter(value === "all" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All assignees" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All assignees</SelectItem>
                      {users && users.length > 0 ? (
                        users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.full_name || 'Unnamed User'}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-users" disabled>No team members available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStatusFilter("all");
                      setPriorityFilter("all");
                      setProjectFilter("all");
                      setAssigneeFilter("all");
                    }}
                  >
                    Reset
                  </Button>
                  <Button>Apply Filters</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button onClick={() => {
            console.log("Add Task button clicked");
            setIsAddTaskOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="todo">To Do</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {renderTasksList(tasks || [])}
        </TabsContent>

        <TabsContent value="todo" className="mt-6">
          {renderTasksList(todoTasks)}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {renderTasksList(completedTasks)}
        </TabsContent>
      </Tabs>

      {/* Add Task Dialog */}
      {isAddTaskOpen && (
        <Dialog open={true} onOpenChange={(open) => {
          console.log("Dialog open state changing to:", open);
          setIsAddTaskOpen(open);
        }}>
          <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Task title"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="description">Description (Display Only)</Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Task description (not saved to database yet)"
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                Note: Description is for display purposes only and will not be saved to the database.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="project">Project</Label>
                <Select
                  value={newTask.project_id || "none"}
                  onValueChange={(value) => setNewTask({ ...newTask, project_id: value === "none" ? "" : value })}
                >
                  <SelectTrigger id="project" className="h-8">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No project</SelectItem>
                    {projectsForTasks?.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 col-span-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="assigned-users">Team Members</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      // Open team page in a new tab
                      window.open('/team', '_blank');
                    }}
                  >
                    <UserPlus className="h-3 w-3 mr-1" />
                    Add Team Member
                  </Button>
                </div>
                <div className="border rounded-md p-1">
                  <div className="text-xs text-red-500 p-2 bg-red-50 mb-2">
                    <strong>DEBUG INFO:</strong><br />
                    Users data available: {users ? 'Yes' : 'No'}<br />
                    Number of users: {users?.length || 0}<br />
                    User IDs: {users?.map(u => u.id).join(', ') || 'None'}<br />
                    User Names: {users?.map(u => u.full_name).join(', ') || 'None'}
                  </div>

                  <div className="flex flex-wrap gap-1 max-h-[100px] overflow-y-auto">
                    {users && users.length > 0 ? (
                      users.map((user) => {
                        if (!user || !user.id) return null;
                        const assignedUsers = Array.isArray(newTask.assigned_users) ? newTask.assigned_users : [];
                        const isSelected = assignedUsers.some(u => u.id === user.id);
                        return (
                          <div
                            key={user.id}
                            className={`px-2 py-0.5 rounded-full text-xs cursor-pointer ${
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground'
                            }`}
                            onClick={() => {
                              let updatedUsers: User[];
                              if (isSelected) {
                                updatedUsers = assignedUsers.filter(u => u.id !== user.id);
                              } else {
                                updatedUsers = [...assignedUsers, user];
                              }
                              setNewTask({
                                ...newTask,
                                assigned_users: updatedUsers
                              });
                            }}
                          >
                            {user.full_name || 'Unnamed User'}
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-xs text-muted-foreground p-2">
                        No team members available. Please add team members first.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between mt-1">
                  {users && users.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Available: {users.length} team member(s)
                    </div>
                  )}
                  {Array.isArray(newTask.assigned_users) && newTask.assigned_users.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Selected: {newTask.assigned_users.length} team member(s)
                    </div>
                  )}
                </div>

                {users && users.length === 0 && (
                  <div className="text-xs text-red-500 mt-1">
                    No team members found. Please add team members on the Team page first.
                  </div>
                )}

                <div className="mt-2 border rounded-md p-2 bg-gray-50">
                  <h4 className="text-xs font-medium mb-2">Quick Add Team Member</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Full Name"
                      className="h-7 text-xs"
                      id="quick-add-name"
                    />
                    <Button
                      variant="default"
                      size="sm"
                      className="h-7"
                      onClick={async () => {
                        const nameInput = document.getElementById('quick-add-name') as HTMLInputElement;
                        if (!nameInput || !nameInput.value.trim()) {
                          toast({
                            title: "Error",
                            description: "Please enter a name for the team member",
                            variant: "destructive"
                          });
                          return;
                        }

                        const fullName = nameInput.value.trim();

                        try {
                          // Generate a UUID for the new team member
                          const id = crypto.randomUUID();

                          // Add the team member to the database
                          const { data, error } = await supabase
                            .from('team_members')
                            .insert({
                              id,
                              full_name: fullName,
                              active: true,
                              role: 'member',
                              email: `${fullName.toLowerCase().replace(/\s+/g, '.')}@example.com` // Add a placeholder email
                            })
                            .select();

                          if (error) {
                            console.error("Error adding team member:", error);
                            toast({
                              title: "Error",
                              description: "Failed to add team member: " + error.message,
                              variant: "destructive"
                            });
                          } else {
                            console.log("Team member added:", data);
                            toast({
                              title: "Success",
                              description: `Team member "${fullName}" added successfully`
                            });

                            // Clear the input
                            nameInput.value = "";

                            // Refresh the users list
                            queryClient.invalidateQueries({ queryKey: ['users-for-tasks'] });
                          }
                        } catch (error) {
                          console.error("Error in quick add team member:", error);
                          toast({
                            title: "Error",
                            description: "An unexpected error occurred",
                            variant: "destructive"
                          });
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newTask.status}
                  onValueChange={(value) => setNewTask({ ...newTask, status: value as any })}
                >
                  <SelectTrigger id="status" className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value as any })}
                >
                  <SelectTrigger id="priority" className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="due-date">Due Date</Label>
              <Input
                id="due-date"
                type="date"
                value={newTask.due_date ? format(newTask.due_date, 'yyyy-MM-dd') : ''}
                onChange={(e) => {
                  console.log("Date input changed:", e.target.value);
                  try {
                    if (e.target.value) {
                      const selectedDate = new Date(e.target.value);
                      console.log("Parsed date:", selectedDate);
                      if (!isNaN(selectedDate.getTime())) {
                        setNewTask({ ...newTask, due_date: selectedDate });
                      }
                    } else {
                      setNewTask({ ...newTask, due_date: null });
                    }
                  } catch (error) {
                    console.error("Error parsing date:", error);
                  }
                }}
                className="h-8"
              />
              {newTask.due_date && (
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Selected: {format(newTask.due_date, 'MMMM d, yyyy')}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => setNewTask({ ...newTask, due_date: null })}
                  >
                    Clear
                  </Button>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => {
                try {
                  // Ensure assigned_users is an array
                  const assignedUsers = Array.isArray(newTask.assigned_users) ? newTask.assigned_users : [];

                  // Log detailed information about the task being added
                  console.log("Adding task with details:", {
                    title: newTask.title,
                    description: newTask.description,
                    project_id: newTask.project_id,
                    status: newTask.status,
                    priority: newTask.priority,
                    assigned_users: assignedUsers,
                    due_date: newTask.due_date
                  });

                  // Log specific information about team members
                  console.log("Team members being assigned:", assignedUsers);
                  console.log("Number of team members:", assignedUsers.length);

                  // Log each team member ID for debugging
                  if (assignedUsers.length > 0) {
                    console.log("Team member IDs:");
                    assignedUsers.forEach((userId, index) => {
                      console.log(`[${index}] ${userId}`);
                    });
                  }

                  // Create a deep copy of the task to ensure we're not modifying the original
                  const taskToAdd = {
                    ...newTask,
                    assigned_users: [...assignedUsers]
                  };

                  console.log("Final task object being submitted:", taskToAdd);

                  // Submit the task
                  addTaskMutation.mutate(taskToAdd);
                } catch (error) {
                  console.error("Error in Add Task button click:", error);
                  toast({
                    title: "Error",
                    description: "There was a problem adding the task. Please try again.",
                    variant: "destructive",
                  });
                }
              }}
              disabled={!newTask.title.trim() || addTaskMutation.isPending}
            >
              {addTaskMutation.isPending ? "Adding..." : "Add Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      )}

      {/* Edit Task Dialog */}
      {currentTask && isEditTaskOpen && (
        <Dialog open={true} onOpenChange={(open) => {
          console.log("Edit Dialog open state changing to:", open);
          setIsEditTaskOpen(open);
        }}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="space-y-1">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={currentTask.title}
                  onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-description">Description (Display Only)</Label>
                <Textarea
                  id="edit-description"
                  value={currentTask.description || ""}
                  onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                  placeholder="Task description (not saved to database yet)"
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">
                  Note: Description is for display purposes only and will not be saved to the database.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="edit-project">Project</Label>
                  <Select
                    value={currentTask.project_id || "none"}
                    onValueChange={(value) => setCurrentTask({ ...currentTask, project_id: value === "none" ? null : value })}
                  >
                    <SelectTrigger id="edit-project" className="h-8">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No project</SelectItem>
                      {projectsForTasks?.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1 col-span-2 mt-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="edit-assigned-users">Team Members</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      // Open team page in a new tab
                      window.open('/team', '_blank');
                    }}
                  >
                    <UserPlus className="h-3 w-3 mr-1" />
                    Add Team Member
                  </Button>
                </div>
                <div className="border rounded-md p-1">
                  <div className="text-xs text-red-500 p-2 bg-red-50 mb-2">
                    <strong>DEBUG INFO (Edit Mode):</strong><br />
                    Users data available: {users ? 'Yes' : 'No'}<br />
                    Number of users: {users?.length || 0}<br />
                    User IDs: {users?.map(u => u.id).join(', ') || 'None'}<br />
                    User Names: {users?.map(u => u.full_name).join(', ') || 'None'}
                  </div>

                  <div className="flex flex-wrap gap-1 max-h-[100px] overflow-y-auto">
                    {users && users.length > 0 ? (
                      users.map((user) => {
                        if (!user || !user.id) return null;
                        // Check if the user is in the assigned_users array by comparing IDs
                        const isSelected = currentTask?.assigned_users?.some(assignedUser => 
                          assignedUser && assignedUser.id === user.id
                        ) || false;

                        console.log(`Checking user ${user.full_name} (${user.id}):`, {
                          isSelected,
                          currentTaskUsers: currentTask?.assigned_users?.map(u => `${u.full_name} (${u.id})`)
                        });

                        return (
                          <div
                            key={user.id}
                            className={`px-2 py-0.5 rounded-full text-xs cursor-pointer ${
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground'
                            }`}
                            onClick={() => {
                              if (!currentTask) return;
                              
                              console.log('Current assigned users before update:', currentTask.assigned_users);
                              
                              let updatedUsers: User[];
                              if (isSelected) {
                                // Remove user if already selected
                                updatedUsers = (currentTask.assigned_users || []).filter(u => u.id !== user.id);
                              } else {
                                // Add user if not selected
                                updatedUsers = [...(currentTask.assigned_users || []), user];
                              }
                              
                              console.log('Updated assigned users:', updatedUsers);
                              
                              setCurrentTask({
                                ...currentTask,
                                assigned_users: updatedUsers
                              });
                            }}
                          >
                            {user.full_name || 'Unnamed User'}
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-xs text-muted-foreground p-2">
                        No team members available. Please add team members first.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between mt-1">
                  {users && users.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Available: {users.length} team member(s)
                    </div>
                  )}
                  {(currentTask.assigned_users?.length || 0) > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Selected: {currentTask.assigned_users?.length} team member(s)
                    </div>
                  )}
                </div>

                {users && users.length === 0 && (
                  <div className="text-xs text-red-500 mt-1">
                    No team members found. Please add team members on the Team page first.
                  </div>
                )}

                <div className="mt-2 border rounded-md p-2 bg-gray-50">
                  <h4 className="text-xs font-medium mb-2">Quick Add Team Member</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Full Name"
                      className="h-7 text-xs"
                      id="edit-quick-add-name"
                    />
                    <Button
                      variant="default"
                      size="sm"
                      className="h-7"
                      onClick={async () => {
                        const nameInput = document.getElementById('edit-quick-add-name') as HTMLInputElement;
                        if (!nameInput || !nameInput.value.trim()) {
                          toast({
                            title: "Error",
                            description: "Please enter a name for the team member",
                            variant: "destructive"
                          });
                          return;
                        }

                        const fullName = nameInput.value.trim();

                        try {
                          // Generate a UUID for the new team member
                          const id = crypto.randomUUID();

                          // Add the team member to the database
                          const { data, error } = await supabase
                            .from('team_members')
                            .insert({
                              id,
                              full_name: fullName,
                              active: true,
                              role: 'member',
                              email: `${fullName.toLowerCase().replace(/\s+/g, '.')}@example.com` // Add a placeholder email
                            })
                            .select();

                          if (error) {
                            console.error("Error adding team member:", error);
                            toast({
                              title: "Error",
                              description: "Failed to add team member: " + error.message,
                              variant: "destructive"
                            });
                          } else {
                            console.log("Team member added:", data);
                            toast({
                              title: "Success",
                              description: `Team member "${fullName}" added successfully`
                            });

                            // Clear the input
                            nameInput.value = "";

                            // Refresh the users list
                            queryClient.invalidateQueries({ queryKey: ['users-for-tasks'] });
                          }
                        } catch (error) {
                          console.error("Error in quick add team member:", error);
                          toast({
                            title: "Error",
                            description: "An unexpected error occurred",
                            variant: "destructive"
                          });
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={currentTask.status}
                    onValueChange={(value) => setCurrentTask({ ...currentTask, status: value as any })}
                  >
                    <SelectTrigger id="edit-status" className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select
                    value={currentTask.priority}
                    onValueChange={(value) => setCurrentTask({ ...currentTask, priority: value as any })}
                  >
                    <SelectTrigger id="edit-priority" className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-due-date">Due Date</Label>
                <Input
                  id="edit-due-date"
                  type="date"
                  value={currentTask.due_date ? format(parseISO(currentTask.due_date), 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    console.log("Edit task - Date input changed:", e.target.value);
                    try {
                      if (e.target.value) {
                        const selectedDate = new Date(e.target.value);
                        console.log("Edit task - Parsed date:", selectedDate);
                        if (!isNaN(selectedDate.getTime())) {
                          setCurrentTask({
                            ...currentTask,
                            due_date: format(selectedDate, 'yyyy-MM-dd')
                          });
                        }
                      } else {
                        setCurrentTask({
                          ...currentTask,
                          due_date: null
                        });
                      }
                    } catch (error) {
                      console.error("Error parsing date:", error);
                    }
                  }}
                  className="h-8"
                />
                {currentTask.due_date && (
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Selected: {formatDate(currentTask.due_date)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2"
                      onClick={() => setCurrentTask({
                        ...currentTask,
                        due_date: null
                      })}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => {
                  deleteTaskMutation.mutate(currentTask.id);
                  setIsEditTaskOpen(false);
                }}
                disabled={deleteTaskMutation.isPending}
              >
                {deleteTaskMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={() => {
                  console.log("Saving task with details:", {
                    id: currentTask.id,
                    title: currentTask.title,
                    project_id: currentTask.project_id,
                    due_date: currentTask.due_date,
                    status: currentTask.status,
                    assigned_users: currentTask.assigned_users?.map(u => `${u.id} (${u.full_name})`)
                  });

                  // Log specific information about team members
                  console.log("Team members being assigned:",
                    currentTask.assigned_users?.map(u => `${u.id} (${u.full_name})`));
                  console.log("Number of team members:", currentTask.assigned_users?.length || 0);

                  // Submit the task update
                  updateTaskMutation.mutate(currentTask);
                }}
                disabled={!currentTask.title.trim() || updateTaskMutation.isPending}
              >
                {updateTaskMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
