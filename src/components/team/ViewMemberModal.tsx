import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle2,
  Mail,
  XCircle,
  AlertCircle,
  Building,
  Briefcase,
  Calendar,
  Shield,
} from "lucide-react";

interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  role: string;
  active: boolean;
  status: "active" | "invited" | "inactive";
  job_title?: string;
  department?: string;
  isInvitation?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ViewMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember;
}

export function ViewMemberModal({ open, onOpenChange, member }: ViewMemberModalProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch member projects from project_members table
  const { data: memberProjects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['member-projects', member.id],
    queryFn: async () => {
      try {
        // Check if project_members table exists
        const { error: tableCheckError } = await supabase
          .from('project_members')
          .select('user_id')
          .limit(1);

        if (tableCheckError) {
          console.log("Project members table may not exist:", tableCheckError);
          return [];
        }

        // Fetch projects this member is assigned to
        const { data, error } = await supabase
          .from('project_members')
          .select(`
            project_id,
            role,
            assigned_at,
            projects:project_id (
              id,
              name,
              description,
              status
            )
          `)
          .eq('user_id', member.id);

        if (error) {
          console.error("Error fetching member projects:", error);
          return [];
        }

        return data || [];
      } catch (error) {
        console.error("Error fetching member projects:", error);
        return [];
      }
    },
    enabled: open, // Only fetch when modal is open
  });

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "invited":
        return <Mail className="h-5 w-5 text-blue-500" />;
      case "inactive":
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get role display name
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "manager":
        return "Manager";
      case "member":
        return "Team Member";
      case "viewer":
        return "Viewer";
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  // Get role badge color
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500";
      case "manager":
        return "bg-orange-500";
      case "member":
        return "bg-blue-500";
      case "viewer":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Team Member Details</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-creatively-purple flex items-center justify-center text-white font-medium text-xl">
            {member.full_name
              ? member.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
              : '?'}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{member.full_name || "Unnamed User"}</h2>
            <p className="text-sm text-muted-foreground">{member.email}</p>
            <div className="flex items-center gap-2 mt-1">
              {getStatusIcon(member.status)}
              <span className="capitalize">{member.status}</span>
              <Badge className={getRoleBadgeClass(member.role)}>
                {getRoleDisplayName(member.role)}
              </Badge>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Job Title:</span>
                  <span>{member.job_title || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Department:</span>
                  <span>{member.department || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Role:</span>
                  <span>{getRoleDisplayName(member.role)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Member Since:</span>
                  <span>{formatDate(member.created_at)}</span>
                </div>
                {member.updated_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Last Updated:</span>
                    <span>{formatDate(member.updated_at)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="mt-4">
            {member.isInvitation ? (
              <Card>
                <CardContent className="py-6 text-center">
                  <p className="text-muted-foreground">
                    Project assignments will be available once the invitation is accepted.
                  </p>
                </CardContent>
              </Card>
            ) : isLoadingProjects ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : !memberProjects || memberProjects.length === 0 ? (
              <Card>
                <CardContent className="py-6 text-center">
                  <p className="text-muted-foreground">
                    This team member is not assigned to any projects.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {memberProjects.map((projectMember: any) => (
                  <Card key={projectMember.project_id}>
                    <CardContent className="py-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{projectMember.projects.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {projectMember.projects.description || "No description"}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge variant="outline">
                              {projectMember.role.charAt(0).toUpperCase() + projectMember.role.slice(1)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Assigned: {formatDate(projectMember.assigned_at)}
                            </span>
                          </div>
                        </div>
                        <Badge className={
                          projectMember.projects.status === "active" ? "bg-green-500" :
                          projectMember.projects.status === "completed" ? "bg-blue-500" :
                          projectMember.projects.status === "on_hold" ? "bg-yellow-500" :
                          "bg-gray-500"
                        }>
                          {projectMember.projects.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
