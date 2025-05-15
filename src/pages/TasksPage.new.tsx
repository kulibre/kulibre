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
  MoreHorizontal
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

// Define Task type
interface Task {
  id: string;
  title: string;
  project_id: string | null;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  project?: {
    id: string;
    name: string;
  };
  assigned_users?: User[];
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
    assigned_users: [] as string[],
    due_date: null as Date | null
  });

  // Fetch tasks with user assignments
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      try {
        // Fetch tasks
        const { data: taskData, error: taskError } = await supabase
          .from('tasks')
          .select(`
            id,
            title,
            project_id,
            due_date,
            completed_at,
            created_at,
            project:project_id (id, name)
          `)
          .order('created_at', { ascending: false });

        if (taskError) throw taskError;

        // If no tasks, return empty array
        if (!taskData || taskData.length === 0) {
          return [] as Task[];
        }

        // Try to fetch user assignments
        let tasksWithUsers = [...taskData] as Task[];

        try {
          // Check if user_tasks table exists
          const { error: tableCheckError } = await supabase
            .from('user_tasks')
            .select('id')
            .limit(1);

          if (!tableCheckError) {
            // Fetch all user assignments for these tasks
            const { data: userTasks, error: userTasksError } = await supabase
              .from('user_tasks')
              .select('task_id, user_id')
              .in('task_id', taskData.map(t => t.id));

            if (!userTasksError && userTasks && userTasks.length > 0) {
              // Fetch all user details
              const userIds = [...new Set(userTasks.map(ut => ut.user_id))];

              const { data: userDetails, error: userDetailsError } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url')
                .in('id', userIds);

              if (!userDetailsError && userDetails) {
                // Create a map of users by ID
                const userMap: Record<string, User> = {};
                userDetails.forEach(user => {
                  userMap[user.id] = user;
                });

                // Group user assignments by task
                const taskUserMap: Record<string, User[]> = {};
                userTasks.forEach(ut => {
                  if (!taskUserMap[ut.task_id]) {
                    taskUserMap[ut.task_id] = [];
                  }

                  const user = userMap[ut.user_id];
                  if (user) {
                    taskUserMap[ut.task_id].push(user);
                  }
                });

                // Add users to tasks
                tasksWithUsers = tasksWithUsers.map(task => ({
                  ...task,
                  assigned_users: taskUserMap[task.id] || []
                }));
              }
            }
          }
        } catch (err) {
          console.error("Error fetching user assignments:", err);
          // Continue with tasks without user assignments
        }

        return tasksWithUsers;
      } catch (error: any) {
        console.error("Error fetching tasks:", error);
        toast({
          title: "Error",
          description: `Failed to load tasks: ${error.message}`,
          variant: "destructive",
        });
        return [];
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

  // Fetch users
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .order('full_name');

        if (error) throw error;
        return data as User[];
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    }
  });

  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: async (task: typeof newTask) => {
      try {
        console.log("Creating task:", task);

        // Insert task
        const { data, error } = await supabase
          .from('tasks')
          .insert([{
            title: task.title,
            project_id: task.project_id !== "none" ? task.project_id : null,
            due_date: task.due_date ? format(task.due_date, 'yyyy-MM-dd') : null,
            completed_at: task.status === 'completed' ? new Date().toISOString() : null
          }])
          .select();

        if (error) throw error;

        // If we have assigned users and task was created successfully
        if (Array.isArray(task.assigned_users) && task.assigned_users.length > 0 && data && data[0]) {
          const taskId = data[0].id;

          // Check if user_tasks table exists
          try {
            const { error: tableCheckError } = await supabase
              .from('user_tasks')
              .select('id')
              .limit(1);

            // If table doesn't exist, create it
            if (tableCheckError) {
              console.log("Creating user_tasks table");
              await supabase.rpc('execute_sql', {
                query: `
                  CREATE TABLE IF NOT EXISTS public.user_tasks (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
                    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                  );
                `
              });
            }

            // Add user assignments one by one
            for (const userId of task.assigned_users) {
              await supabase
                .from('user_tasks')
                .insert({
                  user_id: userId,
                  task_id: taskId
                });
            }
          } catch (err) {
            console.error("Error handling user assignments:", err);
            // Continue even if user assignments fail
          }
        }

        return data;
      } catch (error) {
        console.error("Error in task creation:", error);
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
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
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
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  });

  // Toggle task status
  const toggleTaskStatus = async (task: Task) => {
    try {
      const newStatus = task.completed_at ? null : new Date().toISOString();

      const { error } = await supabase
        .from('tasks')
        .update({ completed_at: newStatus })
        .eq('id', task.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    } catch (error: any) {
      toast({
        title: "Error updating task",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Reset form
  const resetNewTaskForm = () => {
    setNewTask({
      title: "",
      description: "",
      project_id: "none",
      status: "todo",
      assigned_users: [],
      due_date: null
    });
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Handle edit task
  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsEditTaskOpen(true);
  };

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async (task: Task) => {
      try {
        console.log("Updating task:", task);

        // Update task
        const { data, error } = await supabase
          .from('tasks')
          .update({
            title: task.title,
            project_id: task.project_id !== "none" ? task.project_id : null,
            due_date: task.due_date,
            completed_at: task.completed_at
          })
          .eq('id', task.id)
          .select();

        if (error) throw error;

        // Handle user assignments if the task has assigned_users
        if (task.assigned_users) {
          try {
            // First delete existing assignments
            await supabase
              .from('user_tasks')
              .delete()
              .eq('task_id', task.id);

            // Then add new assignments
            if (task.assigned_users.length > 0) {
              for (const user of task.assigned_users) {
                await supabase
                  .from('user_tasks')
                  .insert({
                    user_id: user.id,
                    task_id: task.id
                  });
              }
            }
          } catch (err) {
            console.error("Error updating user assignments:", err);
            // Continue even if user assignments fail
          }
        }

        return data;
      } catch (error) {
        console.error("Error updating task:", error);
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
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Tasks</h1>
        <p className="text-muted-foreground mt-1">Manage your tasks and track progress</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-8 w-full sm:w-[300px]"
          />
        </div>

        <Button onClick={() => setIsAddTaskOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="todo">To Do</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {renderTasks(tasks || [])}
        </TabsContent>

        <TabsContent value="todo" className="mt-6">
          {renderTasks((tasks || []).filter(task => !task.completed_at))}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {renderTasks((tasks || []).filter(task => task.completed_at))}
        </TabsContent>
      </Tabs>

      {/* Add Task Dialog */}
      {isAddTaskOpen && (
        <Dialog open={true} onOpenChange={setIsAddTaskOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Select
                  value={newTask.project_id}
                  onValueChange={(value) => setNewTask({ ...newTask, project_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No project</SelectItem>
                    {projects?.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={newTask.due_date ? format(newTask.due_date, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      setNewTask({ ...newTask, due_date: new Date(e.target.value) });
                    } else {
                      setNewTask({ ...newTask, due_date: null });
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Team Members</Label>
                <div className="border rounded-md p-2 max-h-[150px] overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {users && users.length > 0 ? (
                      users.map((user) => {
                        const isSelected = Array.isArray(newTask.assigned_users) &&
                          newTask.assigned_users.includes(user.id);

                        return (
                          <div
                            key={user.id}
                            className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground'
                            }`}
                            onClick={() => {
                              const currentUsers = Array.isArray(newTask.assigned_users)
                                ? [...newTask.assigned_users]
                                : [];

                              let updatedUsers;
                              if (isSelected) {
                                updatedUsers = currentUsers.filter(id => id !== user.id);
                              } else {
                                updatedUsers = [...currentUsers, user.id];
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
                      <div className="text-sm text-muted-foreground">
                        No team members available
                      </div>
                    )}
                  </div>
                </div>
                {Array.isArray(newTask.assigned_users) && newTask.assigned_users.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {newTask.assigned_users.length} member(s) selected
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={() => addTaskMutation.mutate(newTask)}
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
          if (!open) {
            setIsEditTaskOpen(false);
            setCurrentTask(null);
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={currentTask.title}
                  onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                  placeholder="Task title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-project">Project</Label>
                <Select
                  value={currentTask.project_id || "none"}
                  onValueChange={(value) => setCurrentTask({
                    ...currentTask,
                    project_id: value === "none" ? null : value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No project</SelectItem>
                    {projects?.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-due-date">Due Date</Label>
                <Input
                  id="edit-due-date"
                  type="date"
                  value={currentTask.due_date ? format(parseISO(currentTask.due_date), 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      setCurrentTask({
                        ...currentTask,
                        due_date: format(new Date(e.target.value), 'yyyy-MM-dd')
                      });
                    } else {
                      setCurrentTask({ ...currentTask, due_date: null });
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Team Members</Label>
                <div className="border rounded-md p-2 max-h-[150px] overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {users && users.length > 0 ? (
                      users.map((user) => {
                        const isSelected = currentTask.assigned_users?.some(u => u.id === user.id) || false;

                        return (
                          <div
                            key={user.id}
                            className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground'
                            }`}
                            onClick={() => {
                              const currentUsers = Array.isArray(currentTask.assigned_users)
                                ? [...currentTask.assigned_users]
                                : [];

                              let updatedUsers;
                              if (isSelected) {
                                // Remove user
                                updatedUsers = currentUsers.filter(u => u.id !== user.id);
                              } else {
                                // Add user
                                updatedUsers = [...currentUsers, user];
                              }

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
                      <div className="text-sm text-muted-foreground">
                        No team members available
                      </div>
                    )}
                  </div>
                </div>
                {currentTask.assigned_users && currentTask.assigned_users.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {currentTask.assigned_users.length} member(s) selected
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={currentTask.completed_at ? "completed" : "todo"}
                  onValueChange={(value) => setCurrentTask({
                    ...currentTask,
                    completed_at: value === "completed" ? new Date().toISOString() : null
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this task?")) {
                    deleteTaskMutation.mutate(currentTask.id);
                    setIsEditTaskOpen(false);
                    setCurrentTask(null);
                  }
                }}
              >
                Delete
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={() => updateTaskMutation.mutate(currentTask)}
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

  // Helper function to render tasks
  function renderTasks(tasksList: Task[]) {
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
                  onClick={() => toggleTaskStatus(task)}
                  className="mt-1 focus:outline-none"
                >
                  {task.completed_at ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
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
                          onClick={() => deleteTaskMutation.mutate(task.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {task.project && (
                      <Badge variant="outline">
                        {task.project.name}
                      </Badge>
                    )}
                    {task.due_date && (
                      <Badge variant="secondary">
                        Due: {formatDate(task.due_date)}
                      </Badge>
                    )}
                  </div>

                  {task.assigned_users && task.assigned_users.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-1">Assigned to:</p>
                      <div className="flex flex-wrap gap-1">
                        {task.assigned_users.map(user => (
                          <Badge key={user.id} variant="outline" className="bg-blue-50">
                            {user.full_name || 'Unnamed User'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
}
