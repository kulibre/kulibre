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

              // Try to fetch user details from both team_members and profiles tables
              let userDetails = [];

              // First try team_members
              const { data: teamMemberDetails, error: teamMemberError } = await supabase
                .from('team_members')
                .select('id, full_name, avatar_url')
                .in('id', userIds);

              if (!teamMemberError && teamMemberDetails) {
                userDetails = [...teamMemberDetails];
              }

              // Then try profiles for any remaining IDs
              const remainingIds = userIds.filter(id =>
                !userDetails.some(user => user.id === id)
              );

              if (remainingIds.length > 0) {
                const { data: profileDetails, error: profileError } = await supabase
                  .from('profiles')
                  .select('id, full_name, avatar_url')
                  .in('id', remainingIds);

                if (!profileError && profileDetails) {
                  userDetails = [...userDetails, ...profileDetails];
                }
              }

              if (userDetails && userDetails.length > 0) {
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
  title: string;
  project_id: string | null;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  // These fields are not in the database but used in the UI
  description?: string; // Not in database, added in UI
  status?: "todo" | "in_progress" | "completed"; // Not in database, derived from completed_at
  priority?: "low" | "medium" | "high"; // Not in database, default to medium
  updated_at?: string;
  project?: {
    id: string;
    name: string;
  };
  assigned_users?: User[];
}

// Define Project type for dropdown
interface Project {
  id: string;
  name: string;
}

// Define User type for dropdown
interface User {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

export default function TasksPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [projectFilter, setProjectFilter] = useState<string | null>(null);
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  // Get parameters from URL if present
  const searchParams = new URLSearchParams(window.location.search);
  const taskIdFromUrl = searchParams.get('id');
  const actionFromUrl = searchParams.get('action');
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    project_id: "none",
    status: "todo",
    priority: "medium",
    assigned_users: [] as string[],
    due_date: null as Date | null
  });

  // Ensure assigned_users is always initialized as an array
  useEffect(() => {
    if (!Array.isArray(newTask.assigned_users)) {
      console.log("Initializing assigned_users as empty array");
      setNewTask(prev => ({
        ...prev,
        assigned_users: []
      }));
    }
  }, []);

  // Debug log for users data
  useEffect(() => {
    if (users) {
      console.log("Available team members for selection:", users.map(u => `${u.id} (${u.full_name})`));
    }
  }, [users]);



  // Fetch tasks
  const { data: tasks, isLoading, error, refetch } = useQuery({
    queryKey: ['tasks', searchQuery, statusFilter, priorityFilter, projectFilter, assigneeFilter],
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
    // Always return data even if there's an error
    useErrorBoundary: false,
    queryFn: async () => {
      try {
        // First, fetch the tasks
        let taskData = [];

        try {
          let query = supabase
            .from('tasks')
            .select(`
              id,
              title,
              project_id,
              due_date,
              completed_at,
              created_at,
              project:project_id (id, name)
            `);

          // Apply filters
          if (searchQuery) {
            query = query.ilike('title', `%${searchQuery}%`);
          }

          if (statusFilter) {
            if (statusFilter === 'completed') {
              query = query.not('completed_at', 'is', null);
            } else {
              query = query.is('completed_at', null);
            }
          }

          if (projectFilter && projectFilter !== "all") {
            query = query.eq('project_id', projectFilter);
          }

          // Note: Priority filtering is done client-side since priority is not in the database

          const { data, error } = await query.order('due_date', { ascending: true });

          if (error) {
            console.error("Error fetching tasks:", error);
          } else {
            taskData = data || [];
          }
        } catch (fetchError) {
          console.error("Unexpected error in task fetch:", fetchError);
        }

        // Fetch all user assignments in a single query
        let allUserTasks = [];

        try {
          if (taskData && taskData.length > 0) {
            // First check if the user_tasks table exists
            const { error: tableCheckError } = await supabase
              .from('user_tasks')
              .select('id')
              .limit(1);

            // If there's an error, the table might not exist yet
            if (tableCheckError) {
              console.warn("user_tasks table might not exist yet:", tableCheckError.message);
              // Continue with empty user tasks
            } else {
              // Table exists, proceed with query
              const userTasksResponse = await supabase
                .from('user_tasks')
                .select(`
                  task_id,
                  user_id
                `)
                .in('task_id', taskData.map(task => task.id));

              allUserTasks = userTasksResponse.data || [];
              if (userTasksResponse.error) {
                console.error("Error fetching user tasks:", userTasksResponse.error);
              }
            }
          }
        } catch (error) {
          console.error("Error in user tasks query:", error);
        }

        // Get all unique user IDs
        const userIds = [...new Set(allUserTasks?.map(ut => ut.user_id) || [])];

        // Fetch user details
        let userDetails = [];

        try {
          if (userIds.length > 0) {
            // Try to fetch user details from both team_members and profiles tables
            userDetails = [];

            // First try team_members
            const teamMemberResponse = await supabase
              .from('team_members')
              .select('id, full_name, avatar_url')
              .in('id', userIds);

            if (teamMemberResponse.error) {
              console.error("Error fetching team member details:", teamMemberResponse.error);
            } else if (teamMemberResponse.data) {
              userDetails = [...teamMemberResponse.data];
            }

            // Then try profiles for any remaining IDs
            const remainingIds = userIds.filter(id =>
              !userDetails.some(user => user.id === id)
            );

            if (remainingIds.length > 0) {
              const profileResponse = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url')
                .in('id', remainingIds);

              if (profileResponse.error) {
                console.error("Error fetching profile details:", profileResponse.error);
              } else if (profileResponse.data) {
                userDetails = [...userDetails, ...profileResponse.data];
              }
            }
          }
        } catch (error) {
          console.error("Error in user details query:", error);
        }

        // Create a map of user IDs to user objects
        const userMap: Record<string, User> = {};
        userDetails?.forEach(user => {
          userMap[user.id] = user;
        });

        // Group user assignments by task
        const userTasksByTaskId: Record<string, User[]> = {};
        allUserTasks?.forEach(ut => {
          if (!userTasksByTaskId[ut.task_id]) {
            userTasksByTaskId[ut.task_id] = [];
          }
          const user = userMap[ut.user_id];
          if (user) {
            userTasksByTaskId[ut.task_id].push(user);
          }
        });

        // Add user assignments to tasks and default values for UI
        let tasksWithAssignments = taskData.map(task => ({
          ...task,
          assigned_users: userTasksByTaskId[task.id] || [],
          // Add status based on completed_at since it's not in the database
          status: task.completed_at ? 'completed' : 'todo',
          // Add default priority since it's not in the database
          priority: 'medium',
          // Add empty description for UI
          description: ''
        }));

        // Apply client-side filters

        // Filter by assignee if needed
        if (assigneeFilter && assigneeFilter !== "all") {
          tasksWithAssignments = tasksWithAssignments.filter(task =>
            task.assigned_users?.some(user => user.id === assigneeFilter)
          );
        }

        // Client-side filtering for priority since it's not in the database
        if (priorityFilter && priorityFilter !== "all") {
          tasksWithAssignments = tasksWithAssignments.filter(task =>
            task.priority === priorityFilter
          );
        }

        return tasksWithAssignments as Task[];
      } catch (error) {
        console.error("Unexpected error in task query:", error);
        // Return empty array instead of throwing error
        return [] as Task[];
      }
    }
  });

  // Fetch projects for dropdown
  const { data: projects } = useQuery({
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

  // Fetch users for dropdown
  const { data: users } = useQuery({
    queryKey: ['users-for-tasks'],
    retry: 3, // Increase retries
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000), // Exponential backoff
    queryFn: async () => {
      try {
        console.log("🔍 DEBUGGING: Starting to fetch team members and profiles for task assignment...");

        // First, let's check what tables exist in the database
        console.log("🔍 DEBUGGING: Checking available tables...");
        try {
          const { data: tablesData, error: tablesError } = await supabase
            .rpc('get_tables');

          if (tablesError) {
            console.error("🔍 DEBUGGING: Error checking tables:", tablesError);
          } else {
            console.log("🔍 DEBUGGING: Available tables:", tablesData);
          }
        } catch (error) {
          console.error("🔍 DEBUGGING: Error checking tables:", error);
        }

        let teamMembers: any[] = [];
        let profiles: any[] = [];

        // First try to fetch from team_members table WITHOUT any filters to see all data
        try {
          console.log("🔍 DEBUGGING: Fetching ALL team members without filters...");
          const { data: allTeamMembers, error: allTeamMembersError } = await supabase
            .from('team_members')
            .select('*');

          if (allTeamMembersError) {
            console.error("🔍 DEBUGGING: Error fetching all team members:", allTeamMembersError);
          } else {
            console.log("🔍 DEBUGGING: All team members (unfiltered):", allTeamMembers);
          }

          // Now fetch ALL team members, including inactive ones
          console.log("🔍 DEBUGGING: Fetching ALL team members, including inactive ones...");
          const { data, error } = await supabase
            .from('team_members')
            .select('id, full_name, avatar_url')
            .order('full_name');

          if (error) {
            console.error("🔍 DEBUGGING: Error fetching team members:", error);
          } else {
            teamMembers = data || [];
            console.log("🔍 DEBUGGING: Team members fetched:", teamMembers.length);
            console.log("🔍 DEBUGGING: Team members data:", JSON.stringify(teamMembers, null, 2));
          }
        } catch (error) {
          console.error("🔍 DEBUGGING: Unexpected error fetching team members:", error);
        }

        // Also fetch from profiles table as a fallback
        try {
          console.log("🔍 DEBUGGING: Fetching profiles...");
          const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .order('full_name');

          if (error) {
            console.error("🔍 DEBUGGING: Error fetching profiles:", error);
          } else {
            profiles = data || [];
            console.log("🔍 DEBUGGING: Profiles fetched:", profiles.length);
            console.log("🔍 DEBUGGING: Profiles data:", JSON.stringify(profiles, null, 2));
          }
        } catch (error) {
          console.error("🔍 DEBUGGING: Unexpected error fetching profiles:", error);
        }

        // Create a new array for combined users
        let combinedUsers: any[] = [];

        // Add all team members first
        if (teamMembers.length > 0) {
          combinedUsers = [...teamMembers];
          console.log("🔍 DEBUGGING: Added team members to combined list:", combinedUsers.length);
        } else {
          console.warn("🔍 DEBUGGING: No team members found in the team_members table!");
        }

        // Add profiles that aren't already in the list
        if (profiles.length > 0) {
          let addedProfiles = 0;
          profiles.forEach(profile => {
            // Only add if not already in the list and has a valid ID and name
            if (profile.id && profile.full_name && !combinedUsers.some(user => user.id === profile.id)) {
              combinedUsers.push(profile);
              addedProfiles++;
            }
          });
          console.log(`🔍 DEBUGGING: Added ${addedProfiles} profiles to combined list`);
          console.log("🔍 DEBUGGING: After adding profiles, combined list size:", combinedUsers.length);
        } else {
          console.warn("🔍 DEBUGGING: No profiles found in the profiles table!");
        }

        // Log the combined users for debugging
        console.log("🔍 DEBUGGING: Combined users before filtering:",
          combinedUsers.map(u => ({ id: u.id, name: u.full_name, active: u.active }))
        );

        // If no users found, try a different approach - add all users without filtering
        if (combinedUsers.length === 0) {
          console.warn("🔍 DEBUGGING: No team members or profiles found! Trying to fetch all users without filters...");

          try {
            const { data: allUsers, error: allUsersError } = await supabase
              .from('auth.users')
              .select('id, email');

            if (allUsersError) {
              console.error("🔍 DEBUGGING: Error fetching auth users:", allUsersError);
            } else if (allUsers && allUsers.length > 0) {
              console.log("🔍 DEBUGGING: Found auth users:", allUsers.length);
              // Add these users to our combined list with placeholder names
              allUsers.forEach(user => {
                if (user.id && !combinedUsers.some(u => u.id === user.id)) {
                  combinedUsers.push({
                    id: user.id,
                    full_name: user.email ? user.email.split('@')[0] : 'User',
                    avatar_url: null
                  });
                }
              });
            }
          } catch (error) {
            console.error("🔍 DEBUGGING: Error fetching auth users:", error);
          }
        }

        // If still no users, add a dummy user for testing
        if (combinedUsers.length === 0) {
          console.warn("🔍 DEBUGGING: Still no users found! Adding a dummy user for testing...");
          combinedUsers.push({
            id: "dummy-user-id",
            full_name: "Test User",
            avatar_url: null
          });
        }

        // Make sure we're not filtering out inactive users
        combinedUsers = combinedUsers.map(user => ({
          ...user,
          // Ensure the user is included regardless of active status
          active: true
        }));

        // Sort by name
        combinedUsers.sort((a, b) =>
          (a.full_name || '').localeCompare(b.full_name || '')
        );

        // Log each user for debugging
        console.log("🔍 DEBUGGING: Final combined users for task assignment:",
          combinedUsers.map(u => ({ id: u.id, name: u.full_name }))
        );

        return combinedUsers as User[];
      } catch (error) {
        console.error("🔍 DEBUGGING: Unexpected error in users query:", error);
        // Return empty array instead of failing
        return [] as User[];
      }
    }
  });

  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: async (task: typeof newTask) => {
      try {
        console.log("Starting task creation with:", task);

        // Ensure assigned_users is an array and contains valid values
        const assignedUsers = Array.isArray(task.assigned_users)
          ? task.assigned_users.filter(id => id && typeof id === 'string' && id.trim() !== '')
          : [];

        console.log("Team members to assign (filtered):", assignedUsers);

        // First, insert the task
        const { data, error } = await supabase
          .from('tasks')
          .insert([{
            title: task.title,
            project_id: task.project_id && task.project_id !== "none" ? task.project_id : null,
            due_date: task.due_date ? format(task.due_date, 'yyyy-MM-dd') : null,
            completed_at: task.status === 'completed' ? new Date().toISOString() : null
          }])
          .select();

        if (error) {
          console.error("Error inserting task:", error);
          throw error;
        }

        console.log("Task created successfully:", data);

        // If we have assigned users, create user_task entries
        if (assignedUsers.length > 0 && data && data[0]) {
          const taskId = data[0].id;
          console.log("Adding user assignments for task:", taskId);
          console.log("Assigned users:", assignedUsers);

          try {
            // First check if the user_tasks table exists
            const { error: tableCheckError } = await supabase
              .from('user_tasks')
              .select('id')
              .limit(1);

            if (tableCheckError) {
              console.warn("user_tasks table might not exist yet:", tableCheckError.message);
              console.log("Creating user_tasks table...");

              // Try to create the user_tasks table if it doesn't exist
              // Modified to NOT use foreign key constraints so it can work with both profiles and team_members
              const createTableQuery = `
                CREATE TABLE IF NOT EXISTS public.user_tasks (
                  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                  user_id UUID NOT NULL,
                  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
                  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
              `;

              await supabase.rpc('execute_sql', { query: createTableQuery });
            }

            // Create an array of user_task objects to insert
            const userTaskEntries = assignedUsers.map(userId => ({
              user_id: userId,
              task_id: taskId
            }));

            console.log("Preparing to insert user task entries:", userTaskEntries);

            if (userTaskEntries.length > 0) {
              // Try one-by-one insertion which is more reliable
              for (const userId of assignedUsers) {
                console.log("Adding assignment for user:", userId);

                const { error: singleInsertError } = await supabase
                  .from('user_tasks')
                  .insert({
                    user_id: userId,
                    task_id: taskId
                  });

                if (singleInsertError) {
                  console.error(`Error adding user task assignment for user ${userId}:`, singleInsertError);
                } else {
                  console.log(`Successfully added assignment for user ${userId}`);
                }
              }
            }
          } catch (userTaskError) {
            console.error("Error handling user task assignments:", userTaskError);
            // Continue even if user assignments fail - the task itself was created
          }
        } else {
          console.log("No team members to assign");
        }

        return data;
      } catch (error) {
        console.error("Unexpected error in task creation:", error);
        throw error;
      }
    },
    onSuccess: () => {
      try {
        console.log("Task added successfully, invalidating queries");
        queryClient.invalidateQueries({ queryKey: ['tasks'] });

        console.log("Showing success toast");
        toast({
          title: "Task added",
          description: "The task has been added successfully.",
        });

        console.log("Closing dialog and resetting form");
        setIsAddTaskOpen(false);
        resetNewTaskForm();
      } catch (error) {
        console.error("Error in onSuccess handler:", error);
      }
    },
    onError: (error: any) => {
      try {
        console.error("Error in task mutation:", error);
        toast({
          title: "Error adding task",
          description: error.message || "An unknown error occurred",
          variant: "destructive",
        });
      } catch (toastError) {
        console.error("Error showing error toast:", toastError);
      }
    }
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async (task: Task) => {
      try {
        console.log("Updating task with details:", {
          id: task.id,
          title: task.title,
          project_id: task.project_id,
          due_date: task.due_date,
          status: task.status,
          assigned_users: task.assigned_users?.map(u => `${u.id} (${u.full_name})`)
        });

        // First, update the task
        const { data, error } = await supabase
          .from('tasks')
          .update({
            title: task.title,
            project_id: task.project_id && task.project_id !== "none" ? task.project_id : null,
            due_date: task.due_date,
            completed_at: task.status === 'completed' ? new Date().toISOString() : null
          })
          .eq('id', task.id)
          .select();

        if (error) {
          console.error("Error updating task:", error);
          throw error;
        }

        try {
          // First check if the user_tasks table exists
          const { error: tableCheckError } = await supabase
            .from('user_tasks')
            .select('id')
            .limit(1);

          if (tableCheckError) {
            console.warn("user_tasks table might not exist yet:", tableCheckError.message);
            console.log("Creating user_tasks table...");

            // Try to create the user_tasks table if it doesn't exist
            // Modified to NOT use foreign key constraints so it can work with both profiles and team_members
            const createTableQuery = `
              CREATE TABLE IF NOT EXISTS public.user_tasks (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID NOT NULL,
                task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
              );
            `;

            await supabase.rpc('execute_sql', { query: createTableQuery });
          } else {
            // Always delete existing assignments first
            console.log("Deleting existing user task assignments for task:", task.id);
            const { error: deleteError } = await supabase
              .from('user_tasks')
              .delete()
              .eq('task_id', task.id);

            if (deleteError) {
              console.error("Error deleting existing user task assignments:", deleteError);
              // Continue even if delete fails
            } else {
              console.log("Successfully deleted existing user task assignments");
            }
          }

          // If we have assigned users, create new assignments
          if (Array.isArray(task.assigned_users) && task.assigned_users.length > 0) {
            console.log("Creating new user task assignments for users:",
              task.assigned_users.map(u => `${u.id} (${u.full_name})`));

            // Create user task entries one by one to avoid potential issues
            for (const user of task.assigned_users) {
              if (!user || !user.id) {
                console.warn("Skipping invalid user:", user);
                continue;
              }

              console.log(`Adding assignment for user ${user.id} (${user.full_name || 'Unknown'})`);
              const { error: insertError } = await supabase
                .from('user_tasks')
                .insert({
                  user_id: user.id,
                  task_id: task.id
                });

              if (insertError) {
                console.error(`Error adding user task assignment for user ${user.id}:`, insertError);
                // Continue with other assignments even if one fails
              } else {
                console.log(`Successfully added assignment for user ${user.id}`);
              }
            }
          } else {
            console.log("No team members to assign");
          }
        } catch (userTaskError) {
          console.error("Error handling user task assignments:", userTaskError);
          // Continue even if user assignments fail - the task itself was updated
        }

        return data;
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
      // Make sure we have the assigned_users array
      const taskWithUsers = {
        ...task,
        assigned_users: Array.isArray(task.assigned_users) ? task.assigned_users : []
      };
      setCurrentTask(taskWithUsers);
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
      const taskToEdit = tasks.find(task => task.id === taskIdFromUrl);
      if (taskToEdit) {
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
                      {projects?.map((project) => (
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
                    {projects?.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Removed Primary Assignee field since it's not in the schema */}
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
                  <div className="flex flex-wrap gap-1 max-h-[100px] overflow-y-auto">
                    {users && users.length > 0 ? (
                      users.map((user) => {
                        if (!user || !user.id) {
                          console.warn("Invalid user object found:", user);
                          return null;
                        }

                        // Ensure assigned_users is an array
                        const assignedUsers = Array.isArray(newTask.assigned_users) ? newTask.assigned_users : [];
                        const isSelected = assignedUsers.includes(user.id);

                        // Log for debugging
                        if (isSelected) {
                          console.log(`User ${user.full_name} (${user.id}) is selected`);
                        }

                        return (
                          <div
                            key={user.id}
                            className={`px-2 py-0.5 rounded-full text-xs cursor-pointer ${
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground'
                            }`}
                            onClick={() => {
                              console.log("Clicked on user:", user.full_name, "with ID:", user.id);
                              console.log("Current assigned_users before update:", assignedUsers);

                              try {
                                // Create a new array based on selection state
                                let updatedUsers: string[];

                                if (isSelected) {
                                  console.log("Removing user from assigned_users:", user.id);
                                  updatedUsers = assignedUsers.filter(id => id !== user.id);
                                } else {
                                  console.log("Adding user to assigned_users:", user.id);
                                  updatedUsers = [...assignedUsers, user.id];
                                }

                                console.log("Updated assigned_users:", updatedUsers);

                                // Update the state with the new array
                                setNewTask({
                                  ...newTask,
                                  assigned_users: updatedUsers
                                });
                              } catch (error) {
                                console.error("Error updating team members:", error);
                              }
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

                {/* Quick Add Team Member Form */}
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
                              role: 'member'
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
                      {projects?.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Removed Primary Assignee field since it's not in the schema */}
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
                  <div className="flex flex-wrap gap-1 max-h-[100px] overflow-y-auto">
                    {users && users.length > 0 ? (
                      users.map((user) => {
                        if (!user || !user.id) {
                          console.warn("Invalid user object found in edit mode:", user);
                          return null;
                        }

                        // Safely check if the user is selected
                        const isSelected = Array.isArray(currentTask.assigned_users) &&
                          currentTask.assigned_users.some(u => u.id === user.id);

                        // Log for debugging
                        if (isSelected) {
                          console.log(`Edit mode: User ${user.full_name} (${user.id}) is selected`);
                        }

                        return (
                          <div
                            key={user.id}
                            className={`px-2 py-0.5 rounded-full text-xs cursor-pointer ${
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground'
                            }`}
                            onClick={() => {
                              console.log("Clicked on user in edit mode:", user.full_name, "with ID:", user.id);

                              try {
                                // Ensure we have a valid array to work with
                                const currentUsers = Array.isArray(currentTask.assigned_users)
                                  ? [...currentTask.assigned_users]
                                  : [];

                                console.log("Current assigned_users before update:",
                                  currentUsers.map(u => `${u.id} (${u.full_name})`));

                                let newAssignedUsers: User[];

                                if (isSelected) {
                                  // Remove user
                                  console.log("Removing user from assigned_users:", user.id);
                                  newAssignedUsers = currentUsers.filter(u => u.id !== user.id);
                                } else {
                                  // Add user
                                  console.log("Adding user to assigned_users:", user.id);
                                  newAssignedUsers = [...currentUsers, {...user}];
                                }

                                console.log("Updated assigned_users after change:",
                                  newAssignedUsers.map(u => `${u.id} (${u.full_name})`));

                                // Update the task state with the new assigned users array
                                setCurrentTask({
                                  ...currentTask,
                                  assigned_users: newAssignedUsers
                                });
                              } catch (error) {
                                console.error("Error updating team members:", error);
                              }
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

                {/* Quick Add Team Member Form */}
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
                              role: 'member'
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

  // No duplicate function here
}