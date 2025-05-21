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
  Trash2,
  Upload,
  Download,
  UserPlus,
  Files,
  ChevronLeft,
  Share2,
  Settings,
  Loader2
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
import { UploadDialog } from "@/components/files/UploadDialog";
import type { ProjectType as IProject } from "@/types";

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
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isRemovingMember, setIsRemovingMember] = useState<string | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isDeletingFile, setIsDeletingFile] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch project details
  const { data: project, isLoading, refetch, error: queryError } = useQuery({
    queryKey: ['project', id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) {
        return null;
      }

      try {
        // Fetch project with team members
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select(`
            *,
            team_members:project_members (
              user_id,
              role,
              team_members:user_id (
                id,
                full_name,
                avatar_url,
                email,
                job_title,
                department
              )
            )
          `)
          .eq('id', id)
          .single();

        if (projectError) {
          throw projectError;
        }

        if (!projectData) {
          throw new Error('Project not found');
        }

        // Process data to format team members
        const processedProject = {
          ...projectData,
          team_members: projectData.team_members?.map((member: any) => ({
            ...member.team_members,
            role: member.role
          })) || []
        };

        // Update state
        setProjectName(processedProject.name);
        setProjectStatus(processedProject.status);

        return processedProject as IProject;
      } catch (error: any) {
        console.error("Error in fetchProject:", error);
        // ... rest of error handling ...
      }
    },
  });

  // Fetch users for add-member dropdown
  const { data: users } = useQuery({
    queryKey: ['users-for-project-members', id, project?.team_members],
    queryFn: async () => {
      // Get all team members
      const { data: allTeamMembers, error } = await supabase
        .from('team_members')
        .select('id, full_name, avatar_url, email, job_title, department')
        .eq('active', true)
        .order('full_name');

      if (error) {
        console.error("Error fetching team members:", error);
        throw error;
      }

      // Filter out users who are already team members
      const existingMemberIds = new Set(project?.team_members?.map(member => member.id) || []);
      return allTeamMembers.filter(user => !existingMemberIds.has(user.id));
    },
    enabled: !!id && !!project,
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
    if (tabParam && ['overview', 'files', 'team'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  // Fetch files for this project from Supabase Storage
  const fetchFiles = async () => {
    if (!id) return;
    setIsLoadingFiles(true);
    try {
      const { data, error } = await supabase.storage.from('file_uploads').list(`project_${id}`);
      if (error) throw error;
      setFileList(data || []);
    } catch (e) {
      setFileList([]);
    } finally {
      setIsLoadingFiles(false);
    }
  };
  useEffect(() => { fetchFiles(); }, [id, uploadDialogOpen]);

  // Handle file upload
  const handleUploadComplete = async (file: File) => {
    if (!id) return;
    const filePath = `project_${id}/${file.name}`;
    const { error } = await supabase.storage.from('file_uploads').upload(filePath, file, { upsert: false });
    if (!error) fetchFiles();
    // Optionally: show toast
  };

  // Handle file download
  const handleDownload = async (fileName: string) => {
    if (!id) return;
    const { data, error } = await supabase.storage.from('file_uploads').download(`project_${id}/${fileName}`);
    if (data) {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  // Handle file delete
  const handleDeleteFile = async (fileName: string) => {
    if (!id) return;
    setIsDeletingFile(fileName);
    await supabase.storage.from('file_uploads').remove([`project_${id}/${fileName}`]);
    setIsDeletingFile(null);
    fetchFiles();
  };

  // Add member logic
  const handleAddMember = async () => {
    if (!id || !selectedUserId) return;
    
    try {
      setIsAddingMember(true);
      
      // Add the team member to the project
      const { error } = await supabase
        .from('project_members')
        .insert({
          project_id: id,
          user_id: selectedUserId,
          role: 'member',
          assigned_at: new Date().toISOString()
        });

      if (error) {
        console.error("Error adding team member:", error);
        toast({
          title: "Error",
          description: "Failed to add team member to the project. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Success
      toast({
        title: "Success",
        description: "Team member added to the project successfully.",
      });

      // Reset state and refetch data
      setAddMemberOpen(false);
      setSelectedUserId("");
      refetch();
    } catch (error) {
      console.error("Error in handleAddMember:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingMember(false);
    }
  };

  // Remove member logic
  const handleRemoveMember = async (userId: string) => {
    if (!id) return;
    setIsRemovingMember(userId);
    await supabase.from('project_members').delete().eq('project_id', id).eq('user_id', userId);
    setIsRemovingMember(null);
    refetch();
  };

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
              {(project as IProject).client?.name ? `Client: ${(project as IProject).client!.name}` : "No client assigned"}
            </p>
            <span className="text-muted-foreground">•</span>
            <p className="text-muted-foreground">
              Created: {(project as IProject).created_at ? new Date((project as IProject).created_at!).toLocaleDateString() : "Unknown"}
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
                {(project as IProject).start_date
                  ? new Date((project as IProject).start_date!).toLocaleDateString()
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
                {(project as IProject).due_date
                  ? new Date((project as IProject).due_date!).toLocaleDateString()
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
                {(project as IProject).budget
                  ? `$${(typeof (project as IProject).budget === 'string' ? parseFloat((project as IProject).budget as string) : (project as IProject).budget as number).toLocaleString()}`
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
                      <dd>{(project as IProject).created_at ? new Date((project as IProject).created_at!).toLocaleDateString() : "Unknown"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Last Updated:</dt>
                      <dd>{(project as IProject).updated_at ? new Date((project as IProject).updated_at!).toLocaleDateString() : "Unknown"}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Timeline</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Start Date:</dt>
                      <dd>
                        {(project as IProject).start_date
                          ? new Date((project as IProject).start_date!).toLocaleDateString()
                          : "Not set"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Due Date:</dt>
                      <dd>
                        {(project as IProject).due_date
                          ? new Date((project as IProject).due_date!).toLocaleDateString()
                          : "Not set"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Duration:</dt>
                      <dd>
                        {(project as IProject).start_date && (project as IProject).due_date
                          ? `${Math.ceil(
                              (new Date((project as IProject).due_date!).getTime() -
                                new Date((project as IProject).start_date!).getTime()) /
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

        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Files</CardTitle>
              <Button size="sm" onClick={() => setUploadDialogOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />Upload File
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingFiles ? (
                <p className="text-center text-muted-foreground py-8">Loading files...</p>
              ) : fileList.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No files have been uploaded to this project yet.</p>
              ) : (
                <div className="space-y-2">
                  {fileList.map((file) => (
                    <div key={file.name} className="flex items-center justify-between p-2 border rounded-md">
                      <span>{file.name}</span>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => handleDownload(file.name)}><Download className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteFile(file.name)} disabled={isDeletingFile === file.name}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <UploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} onUploadComplete={handleUploadComplete} currentFolderId={id ? `project_${id}` : null} />
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Team Members</CardTitle>
              <Button size="sm" onClick={() => setAddMemberOpen(true)}><UserPlus className="h-4 w-4 mr-2" />Add Member</Button>
            </CardHeader>
            <CardContent>
              {project.team_members && project.team_members.length > 0 ? (
                <div className="space-y-4">
                  {project.team_members.map((member: any) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-creatively-purple flex items-center justify-center text-white font-medium">
                          {member.full_name ? member.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : '?'}
                        </div>
                        <div>
                          <p className="font-medium">{member.full_name || "Unknown User"}</p>
                          <p className="text-sm text-muted-foreground">{member.role || "Member"}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(member.id)} disabled={isRemovingMember === member.id}>Remove</Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No team members have been added to this project yet.</p>
              )}
            </CardContent>
          </Card>
          {/* Add Member Dialog */}
          <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Label htmlFor="user">Select User</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger id="user"><SelectValue placeholder="Select user" /></SelectTrigger>
                  <SelectContent>
                    {users?.map((user: any) => (
                      <SelectItem key={user.id} value={user.id}>{user.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddMemberOpen(false)}>Cancel</Button>
                <Button onClick={handleAddMember} disabled={!selectedUserId || isAddingMember}>{isAddingMember ? "Adding..." : "Add Member"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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