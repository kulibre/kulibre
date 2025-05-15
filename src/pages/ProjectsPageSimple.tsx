import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { NewProjectModal } from "@/components/projects/NewProjectModal";

// Helper function to format status for display
const formatStatus = (status: string) => {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

// Helper function to get status color
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    in_progress: "bg-blue-100 text-blue-800",
    review: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    completed: "bg-emerald-100 text-emerald-800",
    archived: "bg-purple-100 text-purple-800"
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

export default function ProjectsPageSimple() {
  console.log("ProjectsPageSimple component rendering");
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const [databaseError, setDatabaseError] = useState(false);
  
  // Simplified query
  const { data: projects, isLoading, error, refetch } = useQuery({
    queryKey: ['projects-simple'],
    // Disable automatic error retries
    retry: false,
    queryFn: async () => {
      try {
        console.log("Fetching projects (simplified)...");
        
        // Log the current user
        const { data: authData, error: authError } = await supabase.auth.getUser();
        console.log("Current user:", authData?.user || "No user");
        if (authError) {
          console.error("Auth error:", authError);
        }
        
        // Try a simple query with detailed error logging
        console.log("Trying simple query to projects table...");
        
        try {
          const { data, error } = await supabase
            .from('projects')
            .select('id, name, description, type, status, created_at, due_date')
            .limit(10);
          
          console.log("Query result:", { data, error });
          
          if (error) {
            console.error("Error fetching projects:", error);
            setDatabaseError(true);
            return [];
          }
          
          if (!data || data.length === 0) {
            console.log("No projects found, but table exists");
            return [];
          }
          
          return data;
        } catch (e) {
          console.error("Exception during query:", e);
          setDatabaseError(true);
          return [];
        }
      } catch (error: any) {
        console.error("Error in simplified fetchProjects:", error);
        
        // Only show toast for non-database-related errors
        if (!databaseError) {
          toast({
            title: "Error",
            description: "Failed to load projects. Please try again.",
            variant: "destructive",
          });
        }
        
        return [];
      }
    },
  });
  
  // Log any errors but don't show toast for database errors
  if (error && !databaseError) {
    console.error("Error in useQuery:", error);
    // We'll handle the toast in the catch block of queryFn
  }
  
  // Function to handle navigation to project details
  const handleViewProject = (projectId: string) => {
    console.log("Navigating to project details:", projectId);
    navigate(`/project/${projectId}`);
  }

  console.log("ProjectsPageSimple rendering with data:", { projects, isLoading, databaseError });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage and track all your creative projects
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
          <NewProjectModal onProjectCreated={() => {
            // Refresh the projects list after creating a new project
            window.location.reload();
          }} />
        </div>
      </div>

      {databaseError ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-amber-600">Database Setup Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The projects table doesn't exist in your database yet. This is expected in the demo environment.</p>
            <p className="mt-2">In a production environment, you would need to set up your database tables first.</p>
            <p className="mt-4 text-sm text-gray-600">To set up the database tables, follow these steps:</p>
            <ol className="mt-2 ml-5 list-decimal text-sm text-gray-600">
              <li>Go to your Supabase dashboard</li>
              <li>Navigate to the SQL Editor</li>
              <li>Run the SQL script from <code>supabase/migrations/20240720000000_create_project_tables_simple.sql</code></li>
              <li>Or run the setup script: <code>node setup-database-simple.js</code></li>
            </ol>
            <p className="mt-4 text-sm text-gray-600">
              <strong>Note:</strong> Make sure your database schema matches the application code. 
              The application expects <code>type</code> and <code>status</code> to be TEXT fields, not ENUMs.
            </p>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
              <Button variant="outline" onClick={() => refetch()}>
                Retry Connection
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p>Loading projects...</p>
          </CardContent>
        </Card>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project: any) => (
            <Card 
              key={project.id} 
              className="cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => handleViewProject(project.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <Badge 
                    className={getStatusColor(project.status)}
                    onClick={(e) => e.stopPropagation()} // Prevent card click when clicking on badge
                  >
                    {formatStatus(project.status)}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {new Date(project.created_at).toLocaleDateString()} • {project.type.replace('_', ' ')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{project.description || "No description"}</p>
                {project.due_date && (
                  <p className="text-xs text-gray-500 mt-2">
                    Due: {new Date(project.due_date).toLocaleDateString()}
                  </p>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProject(project.id);
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p>No projects found.</p>
            <Button className="mt-4" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}