import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface Project {
  id: string;
  name: string;
  status: string;
  totalTasks: number;
  completedTasks: number;
  progress: number;
  startDate: string;
  dueDate: string;
}

interface ProjectStatusTableProps {
  projects: Project[];
}

export function ProjectStatusTable({ projects }: ProjectStatusTableProps) {
  // Sort projects by due date (closest first)
  const sortedProjects = [...projects].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return "bg-green-50 text-green-700 border-green-200";
      case 'in progress':
        return "bg-blue-50 text-blue-700 border-blue-200";
      case 'on hold':
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case 'cancelled':
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Function to get progress color
  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Tasks</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProjects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No projects found
              </TableCell>
            </TableRow>
          ) : (
            sortedProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-[100px] relative h-2 overflow-hidden rounded-full bg-gray-100">
                      <div 
                        className={`absolute top-0 left-0 h-full ${getProgressColor(project.progress)}`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs">{project.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  {project.completedTasks} / {project.totalTasks}
                </TableCell>
                <TableCell>
                  {formatDate(project.dueDate)}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/projects/${project.id}`}>
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
