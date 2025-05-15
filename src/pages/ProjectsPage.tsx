import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Grid3x3, List, Plus, Search, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { NewProjectModal } from "@/components/projects/NewProjectModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

export default function ProjectsPage() {
  console.log("ProjectsPage component rendering");

  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<"draft" | "in_progress" | "review" | "approved" | "completed" | "archived" | "all">("all");
  const [typeFilter, setTypeFilter] = useState<"website" | "mobile_app" | "branding" | "marketing" | "design" | "development" | "other" | "all">("all");
  const [sortBy, setSortBy] = useState<string>("created_at:desc");
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [databaseError, setDatabaseError] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  // Fetch projects
  const { data: projects, isLoading, refetch, error } = useQuery({
    queryKey: ['projects', statusFilter, typeFilter, sortBy],
    queryFn: async () => {
      try {
        console.log("Fetching projects...");

        // First, check if the projects table exists
        const { error: tableCheckError } = await supabase
          .from('projects')
          .select('id')
          .limit(1);

        if (tableCheckError) {
          console.error("Error checking projects table:", tableCheckError);

          // If the table doesn't exist, we'll return an empty array
          if (tableCheckError.message.includes("relation") && tableCheckError.message.includes("does not exist")) {
            console.log("Projects table doesn't exist.");
            setDatabaseError(true);
            return [];
          }

          throw tableCheckError;
        }

        console.log("Projects table exists, continuing...");

        // Build query
        let query = supabase
          .from('projects')
          .select(`
            *,
            client:client_id (id, name),
            team_members:project_members (
              user_id,
              profiles:user_id (id, full_name, avatar_url)
            )
          `);

        // Apply filters
        if (statusFilter && statusFilter !== "all") {
          query = query.eq('status', statusFilter as any);
        }

        if (typeFilter && typeFilter !== "all") {
          query = query.eq('type', typeFilter as any);
        }

        // Apply sorting
        const [sortField, sortDirection] = sortBy.split(':');
        query = query.order(sortField, { ascending: sortDirection === 'asc' });

        // Execute query
        const { data, error } = await query;

        if (error) {
          throw error;
        }

        console.log("Projects fetched successfully:", data);

        // Process data to format team members
        return data.map((project: any) => ({
          ...project,
          team_members: project.team_members?.map((member: any) => member.profiles) || []
        }));
      } catch (error: any) {
        console.error("Error in fetchProjects:", error);

        // Check if this is a Supabase connection error
        if (error.message && (
            error.message.includes("Failed to fetch") ||
            error.message.includes("NetworkError") ||
            error.message.includes("network") ||
            error.message.includes("connection")
          )) {
          console.log("This appears to be a connection error");
          setDatabaseError(true);
        }

        toast({
          title: "Error loading projects",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive",
        });

        return [];
      }
    },
  });

  // Filter projects based on search query
  const filteredProjects = projects?.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.client?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

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

  const handleEditProject = (project: any) => {
    setEditingProject({
      ...project,
      start_date: project.start_date ? new Date(project.start_date).toISOString().split('T')[0] : '',
      due_date: project.due_date ? new Date(project.due_date).toISOString().split('T')[0] : ''
    });
  };

  const handleUpdateProject = async () => {
    if (!editingProject) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("projects")
        .update({
          name: editingProject.name,
          description: editingProject.description,
          status: editingProject.status,
          type: editingProject.type,
          start_date: editingProject.start_date || null,
          due_date: editingProject.due_date || null,
          updated_at: new Date().toISOString()
        })
        .eq("id", editingProject.id);

      if (error) throw error;

      toast({
        title: "Project updated",
        description: "Project has been updated successfully.",
      });

      setEditingProject(null);
      refetch();
    } catch (error: any) {
      toast({
        title: "Error updating project",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectToDelete);

      if (error) throw error;

      toast({
        title: "Project deleted",
        description: "Project has been deleted successfully.",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error deleting project",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  // Calculate project progress
  const calculateProgress = (project: any) => {
    // In a real app, this would be based on completed tasks or milestones
    // For now, we'll use a random value between 0-100
    return Math.floor(Math.random() * 101);
  };

  // Helper function to render database setup alert
  const renderDatabaseSetupAlert = () => (
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
            {`-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
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
CREATE TABLE IF NOT EXISTS project_members (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (project_id, user_id)
);`}
          </code>
        </pre>
        <Button onClick={() => refetch()}>Refresh</Button>
      </CardContent>
    </Card>
  );

  // Helper function to render a project card
  const renderProjectCard = (project: any) => (
    <Card
      key={project.id}
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/project/${project.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold hover:text-creatively-purple">
              {project.name}
            </CardTitle>
            <CardDescription>
              {project.client?.name || "No client"}
            </CardDescription>
          </div>
          <Badge
            className={statusColors[project.status] || "bg-gray-100"}
            onClick={(e) => e.stopPropagation()} // Prevent card click when clicking on badge
          >
            {formatStatus(project.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description || "No description provided"}
        </p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{calculateProgress(project)}%</span>
          </div>
          <Progress value={calculateProgress(project)} className="h-2" />
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/project/${project.id}`);
            }}
          >
            View Details
          </Button>
        </div>

        <div className="flex justify-between items-center pt-2">
          <div className="flex -space-x-2">
            {project.team_members && project.team_members.slice(0, 3).map((member: any, index: number) => (
              <Avatar key={index} className="border-2 border-background h-8 w-8">
                <AvatarFallback className="text-xs">
                  {member.full_name ? member.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : '?'}
                </AvatarFallback>
              </Avatar>
            ))}
            {project.team_members && project.team_members.length > 3 && (
              <Avatar className="border-2 border-background h-8 w-8">
                <AvatarFallback className="text-xs bg-muted">
                  +{project.team_members.length - 3}
                </AvatarFallback>
              </Avatar>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => e.stopPropagation()} // Prevent card click when clicking on dropdown
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={project.status} onValueChange={(value) => {
                handleEditProject({...project, status: value});
                handleUpdateProject();
              }}>
                <DropdownMenuRadioItem value="draft">Draft</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="in_progress">In Progress</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="review">Review</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="approved">Approved</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="completed">Completed</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="archived">Archived</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );

  const renderProjectRow = (project: any) => (
    <TableRow
      key={project.id}
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => navigate(`/project/${project.id}`)}
    >
      <TableCell>
        <div className="font-medium hover:text-creatively-purple">
          {project.name}
        </div>
        <div className="text-sm text-muted-foreground">
          {project.client?.name || "No client"}
        </div>
      </TableCell>
      <TableCell>
        <Badge
          className={statusColors[project.status] || "bg-gray-100"}
          onClick={(e) => e.stopPropagation()} // Prevent row click when clicking on badge
        >
          {formatStatus(project.status)}
        </Badge>
      </TableCell>
      <TableCell>{formatStatus(project.type)}</TableCell>
      <TableCell>
        <div className="flex -space-x-2">
          {project.team_members && project.team_members.slice(0, 3).map((member: any, index: number) => (
            <Avatar key={index} className="border-2 border-background h-8 w-8">
              <AvatarFallback className="text-xs">
                {member.full_name ? member.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : '?'}
              </AvatarFallback>
            </Avatar>
          ))}
          {project.team_members && project.team_members.length > 3 && (
            <Avatar className="border-2 border-background h-8 w-8">
              <AvatarFallback className="text-xs bg-muted">
                +{project.team_members.length - 3}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </TableCell>
      <TableCell>
        {project.due_date ? new Date(project.due_date).toLocaleDateString() : "No date"}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Progress value={calculateProgress(project)} className="h-2 w-20" />
          <span className="text-sm">{calculateProgress(project)}%</span>
        </div>
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}> {/* Prevent row click when clicking on dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup value={project.status} onValueChange={(value) => {
              handleEditProject({...project, status: value});
              handleUpdateProject();
            }}>
              <DropdownMenuRadioItem value="draft">Draft</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="in_progress">In Progress</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="review">Review</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="approved">Approved</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="completed">Completed</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="archived">Archived</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
  );

  // Log any errors
  if (error) {
    console.error("Error in useQuery:", error);
  }

  console.log("ProjectsPage rendering with data:", { projects, isLoading, databaseError });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage and track all your creative projects
          </p>
        </div>
        <NewProjectModal onProjectCreated={refetch} />
      </div>

      {databaseError && renderDatabaseSetupAlert()}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value as "draft" | "in_progress" | "review" | "approved" | "completed" | "archived" | "all")}>
            <SelectTrigger className="w-[130px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>{statusFilter !== "all" ? formatStatus(statusFilter) : "All Status"}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value as "website" | "mobile_app" | "branding" | "marketing" | "design" | "development" | "other" | "all")}>
            <SelectTrigger className="w-[130px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>{typeFilter !== "all" ? formatStatus(typeFilter) : "All Types"}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="mobile_app">Mobile App</SelectItem>
              <SelectItem value="branding">Branding</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="development">Development</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[130px]">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Sort By
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                <DropdownMenuRadioItem value="created_at:desc">Newest First</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="created_at:asc">Oldest First</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name:asc">Name (A-Z)</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name:desc">Name (Z-A)</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="due_date:asc">Due Date (Earliest)</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="due_date:desc">Due Date (Latest)</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="rounded-l-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="h-[300px]">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-2 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4, 5].map(i => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-5 w-40 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      ) : filteredProjects.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => renderProjectCard(project))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map(project => renderProjectRow(project))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      ) : (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-4">
            {searchQuery || (statusFilter && statusFilter !== "all") || (typeFilter && typeFilter !== "all")
              ? "No projects match your filters. Try adjusting your search criteria."
              : "No projects found. Create your first project to get started."}
          </p>
          <NewProjectModal
            trigger={<Button>Create New Project</Button>}
            onProjectCreated={refetch}
          />
        </Card>
      )}

      {/* Edit Project Dialog */}
      {editingProject && (
        <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingProject.description || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editingProject.status}
                    onValueChange={(value) => setEditingProject({ ...editingProject, status: value })}
                  >
                    <SelectTrigger id="status">
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
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={editingProject.type}
                    onValueChange={(value) => setEditingProject({ ...editingProject, type: value })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="mobile_app">Mobile App</SelectItem>
                      <SelectItem value="branding">Branding</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={editingProject.start_date || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, start_date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={editingProject.due_date || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, due_date: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => {
                  setProjectToDelete(editingProject.id);
                  setIsDeleteDialogOpen(true);
                }}
              >
                Delete
              </Button>
              <div className="flex-1"></div>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleUpdateProject} disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this project? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProject}>
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}