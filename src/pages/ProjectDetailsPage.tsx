import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Edit,
  MoreHorizontal,
  Users,
  Plus,
  CheckCircle2,
  Circle,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { format, parseISO } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditingName, setIsEditingName] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [projectStatus, setProjectStatus] = useState<string>("draft");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [databaseError, setDatabaseError] = useState(false);

  // Define a type for the project object to handle optional properties
  type ProjectType = {
    id: string;
    name: string;
    description: string;
    type: string;
    status: string;
    team_members: any[];
    client?: { id: string; name: string };
    client_id?: string;
    start_date?: string | null;
    due_date?: string | null;
    budget?: number | string | null;
    created_at?: string;
    updated_at?: string;
  };

  // Fetch project details
  const { data: project, isLoading, refetch, error: queryError } = useQuery({
    queryKey: ['project', id],
    retry: 1, // Limit retries to avoid excessive attempts
    queryFn: async () => {
      if (!id) {
        console.error("No project ID provided");
        toast({
          title: "Error",
          description: "Project ID is required",
          variant: "destructive",
        });
        navigate('/projects');
        return null;
      }

      try {
        console.log("Fetching project details for ID:", id);

        // First, check if the projects table exists
        const { data: tableCheck, error: tableCheckError } = await supabase
          .from('projects')
          .select('id')
          .limit(1);

        console.log("Table check result:", { tableCheck, tableCheckError });

        if (tableCheckError) {
          console.error("Error checking projects table:", tableCheckError);

          // If the table doesn't exist, show a message
          if (tableCheckError.message.includes("relation") && tableCheckError.message.includes("does not exist")) {
            console.log("Projects table doesn't exist.");
            setDatabaseError(true);
            return null;
          }

          throw tableCheckError;
        }

        // Fetch project details with simplified query first
        console.log("Fetching basic project data first...");
        const { data: basicProject, error: basicProjectError } = await supabase
          .from('projects')
          .select('id, name, description, type, status')
          .eq('id', id)
          .single();

        if (basicProjectError) {
          console.error("Error fetching basic project data:", basicProjectError);

          if (basicProjectError.code === 'PGRST116') {
            console.log("Project not found");
            toast({
              title: "Project not found",
              description: "The project you're looking for doesn't exist or you don't have access to it.",
              variant: "destructive",
            });
            navigate('/projects', { replace: true });
            return null;
          }

          throw basicProjectError;
        }

        console.log("Basic project data fetched successfully:", basicProject);

        // Now fetch full project details
        console.log("Fetching complete project details...");
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select(`
            *,
            client:client_id (id, name),
            team_members:project_members (
              user_id,
              role,
              profiles:user_id (id, full_name, avatar_url)
            )
          `)
          .eq('id', id)
          .single();

        if (projectError) {
          console.error("Error fetching complete project details:", projectError);

          // If we at least have basic project data, use that
          if (basicProject) {
            console.log("Using basic project data as fallback");
            setProjectName(basicProject.name);
            setProjectStatus(basicProject.status);
            return {
              ...basicProject,
              team_members: []
            } as ProjectType;
          }

          throw projectError;
        }

        console.log("Project fetched successfully:", projectData);

        // Process data to format team members
        const processedProject = {
          ...projectData,
          team_members: projectData.team_members?.map((member: any) => ({
            ...member.profiles,
            role: member.role
          })) || []
        };

        // Update state
        setProjectName(processedProject.name);
        setProjectStatus(processedProject.status);

        return processedProject as ProjectType;
      } catch (error: any) {
        console.error("Error in fetchProject:", error);

        // Check if this is a Supabase connection error
        if (error.message && (
            error.message.includes("Failed to fetch") ||
            error.message.includes("NetworkError") ||
            error.message.includes("network") ||
            error.message.includes("connection")
          )) {
          console.log("This appears to be a connection error");
          setDatabaseError(true);
          return null;
        }

        toast({
          title: "Error loading project",
          description: error.message || "Failed to load project details. Please try again.",
          variant: "destructive",
        });
        return null;
      }
    },
  });

  // Format status for display
  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Status colors
  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    in_progress: "bg-blue-100 text-blue-700",
    review: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    completed: "bg-purple-100 text-purple-700",
    archived: "bg-red-100 text-red-700"
  };

  const handleUpdateName = async () => {
    if (!id || !projectName.trim()) return;

    setIsUpdatingName(true);
    try {
      const { error } = await supabase
        .from("projects")
        .update({ name: projectName })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Project updated",
        description: "Project name has been updated successfully.",
      });

      setIsEditingName(false);
      refetch();
    } catch (error: any) {
      toast({
        title: "Error updating project",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!id || !projectStatus) return;

    setIsUpdatingStatus(true);
    try {
      const { error } = await supabase
        .from("projects")
        .update({ status: projectStatus })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: "Project status has been updated successfully.",
      });

      setIsEditingStatus(false);
      refetch();
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!id) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Project deleted",
        description: "Project has been deleted successfully.",
      });

      navigate("/projects");
    } catch (error: any) {
      toast({
        title: "Error deleting project",
        description: error.message,
        variant: "destructive",
      });
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('tab', value);
    window.history.pushState({}, '', url);
  };

  // Set initial tab from URL
  useEffect(() => {
    const url = new URL(window.location.href);
    const tabParam = url.searchParams.get('tab');
    if (tabParam && ['overview', 'tasks', 'files', 'team'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>

        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div className="flex-1">
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <Skeleton className="h-20 w-40" />
          <Skeleton className="h-20 w-40" />
          <Skeleton className="h-20 w-40" />
          <Skeleton className="h-20 w-40" />
        </div>

        <Skeleton className="h-10 w-full mb-6" />

        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (databaseError) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/projects")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-muted-foreground">Back to Projects</span>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-amber-600">Database Setup Required</CardTitle>
            <CardDescription>
              The projects table doesn't exist in your database yet. You need to set up the database schema.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              To create the necessary tables for projects, you can run the migration script:
            </p>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
              <code>
                {`-- Create projects table with TEXT fields (not ENUMs)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  type TEXT NOT NULL DEFAULT 'other',
  status TEXT NOT NULL DEFAULT 'draft',
  start_date DATE,
  due_date DATE,
  budget DECIMAL(12,2),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_members table
CREATE TABLE IF NOT EXISTS public.project_members (
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (project_id, user_id)
);`}
              </code>
            </pre>
            <p className="text-sm text-amber-600 mt-4">
              <strong>Important:</strong> Make sure your database schema matches the application code.
              The application expects <code>type</code> and <code>status</code> to be TEXT fields, not ENUMs.
            </p>
            <p className="text-sm mt-2">
              You can find the complete SQL script at: <code>supabase/migrations/20240720000000_create_project_tables_simple.sql</code>
            </p>
            <p className="text-sm mt-2">
              Or run the setup script: <code>node setup-database-simple.js</code>
            </p>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => navigate("/projects")}>
                Back to Projects
              </Button>
              <Button variant="outline" onClick={() => refetch()}>
                Retry Connection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Log any query errors
  if (queryError) {
    console.error("Query error in ProjectDetailsPage:", queryError);
  }

  if (!project) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The project you're looking for doesn't exist or you don't have access to it.
          </p>
          <p className="text-sm text-red-500 mb-4">
            {queryError ? `Error: ${queryError instanceof Error ? queryError.message : 'Unknown error'}` : ''}
          </p>
          <Button onClick={() => navigate("/projects")}>
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/projects")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-muted-foreground">Back to Projects</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <div className="flex-1">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="text-2xl font-bold h-auto py-1 max-w-md"
              />
              <Button
                size="sm"
                onClick={handleUpdateName}
                disabled={isUpdatingName || !projectName.trim()}
              >
                {isUpdatingName ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setProjectName(project.name);
                  setIsEditingName(false);
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsEditingName(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex items-center gap-2 mt-1">
            <p className="text-muted-foreground">
              {(project as ProjectType).client?.name ? `Client: ${(project as ProjectType).client!.name}` : "No client assigned"}
            </p>
            <span className="text-muted-foreground">•</span>
            <p className="text-muted-foreground">
              Created: {(project as ProjectType).created_at ? new Date((project as ProjectType).created_at!).toLocaleDateString() : "Unknown"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditingStatus ? (
            <div className="flex items-center gap-2">
              <Select
                value={projectStatus}
                onValueChange={(value: any) => setProjectStatus(value as "draft" | "in_progress" | "review" | "approved" | "completed" | "archived")}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={handleUpdateStatus}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setProjectStatus(project.status);
                  setIsEditingStatus(false);
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Badge className={statusColors[project.status] || "bg-gray-100"}>
                {formatStatus(project.status)}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsEditingStatus(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditingName(true)}>
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsEditingStatus(true)}>
                Change Status
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setConfirmDelete(true)}
              >
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-medium">
                {(project as ProjectType).start_date
                  ? new Date((project as ProjectType).start_date!).toLocaleDateString()
                  : "Not set"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <Clock className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Due Date</p>
              <p className="font-medium">
                {(project as ProjectType).due_date
                  ? new Date((project as ProjectType).due_date!).toLocaleDateString()
                  : "Not set"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Budget</p>
              <p className="font-medium">
                {(project as ProjectType).budget
                  ? `$${(typeof (project as ProjectType).budget === 'string' ? parseFloat((project as ProjectType).budget as string) : (project as ProjectType).budget as number).toLocaleString()}`
                  : "Not set"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Team Members</p>
              <p className="font-medium">
                {project.team_members?.length || 0} members
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              {project.description ? (
                <p className="whitespace-pre-wrap">{project.description}</p>
              ) : (
                <p className="text-muted-foreground italic">No description provided</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">General Information</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Project Type:</dt>
                      <dd>{formatStatus(project.type)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Status:</dt>
                      <dd>
                        <Badge className={statusColors[project.status] || "bg-gray-100"}>
                          {formatStatus(project.status)}
                        </Badge>
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Created:</dt>
                      <dd>{(project as ProjectType).created_at ? new Date((project as ProjectType).created_at!).toLocaleDateString() : "Unknown"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Last Updated:</dt>
                      <dd>{(project as ProjectType).updated_at ? new Date((project as ProjectType).updated_at!).toLocaleDateString() : "Unknown"}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Timeline</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Start Date:</dt>
                      <dd>
                        {(project as ProjectType).start_date
                          ? new Date((project as ProjectType).start_date!).toLocaleDateString()
                          : "Not set"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Due Date:</dt>
                      <dd>
                        {(project as ProjectType).due_date
                          ? new Date((project as ProjectType).due_date!).toLocaleDateString()
                          : "Not set"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Duration:</dt>
                      <dd>
                        {(project as ProjectType).start_date && (project as ProjectType).due_date
                          ? `${Math.ceil(
                              (new Date((project as ProjectType).due_date!).getTime() -
                                new Date((project as ProjectType).start_date!).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )} days`
                          : "Not available"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <ProjectTasksTab projectId={id} />
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Files</CardTitle>
              <Button size="sm">Upload File</Button>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                No files have been uploaded to this project yet.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Team Members</CardTitle>
              <Button size="sm">Add Member</Button>
            </CardHeader>
            <CardContent>
              {project.team_members && project.team_members.length > 0 ? (
                <div className="space-y-4">
                  {project.team_members.map((member: any) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-creatively-purple flex items-center justify-center text-white font-medium">
                          {member.full_name
                            ? member.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
                            : '?'}
                        </div>
                        <div>
                          <p className="font-medium">{member.full_name || "Unknown User"}</p>
                          <p className="text-sm text-muted-foreground">{member.role || "Member"}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Remove</Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No team members have been added to this project yet.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this project? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDelete(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProject}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ProjectTasksTab component for the Tasks tab in project details
interface ProjectTasksTabProps {
  projectId?: string;
}

function ProjectTasksTab({ projectId }: ProjectTasksTabProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    assigned_to: "unassigned",
    due_date: null as Date | null
  });

  // Fetch tasks for this project
  const { data: tasks, isLoading, error, refetch } = useQuery({
    queryKey: ['project-tasks', projectId],
    queryFn: async () => {
      if (!projectId) return [];

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:assigned_to (id, full_name, avatar_url)
        `)
        .eq('project_id', projectId)
        .order('due_date', { ascending: true });

      if (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }

      return data;
    },
    enabled: !!projectId
  });

  // Fetch users for dropdown
  const { data: users } = useQuery({
    queryKey: ['users-for-project-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .order('full_name');

      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }

      return data;
    }
  });

  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: async (task: typeof newTask) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: task.title,
          description: task.description,
          project_id: projectId,
          status: task.status,
          priority: task.priority,
          assigned_to: task.assigned_to === "unassigned" ? null : task.assigned_to,
          due_date: task.due_date ? format(task.due_date, 'yyyy-MM-dd') : null
        }])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks'] });
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
    mutationFn: async (task: any) => {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assigned_to: task.assigned_to === "unassigned" ? null : task.assigned_to,
          due_date: task.due_date,
          completed_at: task.status === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', task.id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks'] });
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
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks'] });
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
    mutationFn: async ({ taskId, newStatus }: { taskId: string; newStatus: string }) => {
      const { error } = await supabase
        .from('tasks')
        .update({
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating task status",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Reset new task form
  const resetNewTaskForm = () => {
    setNewTask({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      assigned_to: "unassigned",
      due_date: null
    });
  };

  // Handle edit task
  const handleEditTask = (task: any) => {
    setCurrentTask(task);
    setIsEditTaskOpen(true);
  };

  // Handle task status toggle
  const handleToggleStatus = (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    toggleTaskStatusMutation.mutate({ taskId, newStatus });
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error("Invalid date:", dateString);
      return 'Invalid date';
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: "bg-red-100 text-red-800",
      medium: "bg-amber-100 text-amber-800",
      low: "bg-green-100 text-green-800"
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  // Filter tasks by status for tabs
  const todoTasks = tasks?.filter(task => task.status === 'todo') || [];
  const inProgressTasks = tasks?.filter(task => task.status === 'in_progress') || [];
  const completedTasks = tasks?.filter(task => task.status === 'completed') || [];

  if (!projectId) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Project ID is required to view tasks</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tasks</CardTitle>
          <Button size="sm" onClick={() => setIsAddTaskOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({tasks?.length || 0})</TabsTrigger>
              <TabsTrigger value="todo">To Do ({todoTasks.length})</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress ({inProgressTasks.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {renderTasksList(tasks || [])}
            </TabsContent>

            <TabsContent value="todo" className="mt-6">
              {renderTasksList(todoTasks)}
            </TabsContent>

            <TabsContent value="in_progress" className="mt-6">
              {renderTasksList(inProgressTasks)}
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              {renderTasksList(completedTasks)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Task description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Select
                value={newTask.assigned_to}
                onValueChange={(value) => setNewTask({ ...newTask, assigned_to: value })}
              >
                <SelectTrigger id="assignee">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {users?.map((user: any) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newTask.status}
                  onValueChange={(value) => setNewTask({ ...newTask, status: value as any })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value as any })}
                >
                  <SelectTrigger id="priority">
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
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {newTask.due_date ? format(newTask.due_date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={newTask.due_date}
                    onSelect={(date) => setNewTask({ ...newTask, due_date: date })}
                    initialFocus
                    className="calendar-fix"
                    components={{
                      Day: ({ date: dayDate, ...props }) => {
                        return (
                          <div
                            {...props}
                            data-day
                          >
                            {dayDate.getDate()}
                          </div>
                        );
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
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

      {/* Edit Task Dialog */}
      {currentTask && (
        <Dialog open={isEditTaskOpen} onOpenChange={setIsEditTaskOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={currentTask.title}
                  onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={currentTask.description || ""}
                  onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-assignee">Assignee</Label>
                <Select
                  value={currentTask.assigned_to || "unassigned"}
                  onValueChange={(value) => setCurrentTask({ ...currentTask, assigned_to: value })}
                >
                  <SelectTrigger id="edit-assignee">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {users?.map((user: any) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={currentTask.status}
                    onValueChange={(value) => setCurrentTask({ ...currentTask, status: value as any })}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select
                    value={currentTask.priority}
                    onValueChange={(value) => setCurrentTask({ ...currentTask, priority: value as any })}
                  >
                    <SelectTrigger id="edit-priority">
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
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {currentTask.due_date ? formatDate(currentTask.due_date) : <span>No due date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={currentTask.due_date ? parseISO(currentTask.due_date) : undefined}
                      onSelect={(date) => setCurrentTask({
                        ...currentTask,
                        due_date: date ? format(date, 'yyyy-MM-dd') : null
                      })}
                      initialFocus
                      className="calendar-fix"
                      components={{
                        Day: ({ date: dayDate, ...props }) => {
                          return (
                            <div
                              {...props}
                              data-day
                            >
                              {dayDate.getDate()}
                            </div>
                          );
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
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
                onClick={() => updateTaskMutation.mutate(currentTask)}
                disabled={!currentTask.title.trim() || updateTaskMutation.isPending}
              >
                {updateTaskMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );

  // Helper function to render tasks list
  function renderTasksList(tasksList: any[]) {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2 mt-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-500 mb-2">Error loading tasks</p>
          <p className="text-muted-foreground">There was a problem loading tasks for this project.</p>
          <Button onClick={() => refetch()} variant="outline" className="mt-4">
            Retry
          </Button>
        </div>
      );
    }

    if (tasksList.length === 0) {
      return (
        <p className="text-center text-muted-foreground py-8">
          No tasks have been created for this project yet.
        </p>
      );
    }

    return (
      <div className="space-y-4">
        {tasksList.map((task) => (
          <div key={task.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <button
              onClick={() => handleToggleStatus(task.id, task.status)}
              className="mt-1"
            >
              {getStatusIcon(task.status)}
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
                      className="text-red-600"
                      onClick={() => deleteTaskMutation.mutate(task.id)}
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
                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                  {task.priority} priority
                </Badge>
                {task.due_date && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-800">
                    Due {formatDate(task.due_date)}
                  </Badge>
                )}
                {task.assignee && (
                  <Badge variant="outline" className="bg-gray-100 text-gray-800">
                    Assigned to {task.assignee.full_name}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}