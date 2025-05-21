import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  active?: boolean;
}

interface TeamPerformanceTableProps {
  teamMembers: TeamMember[];
}

export function TeamPerformanceTable({ teamMembers }: TeamPerformanceTableProps) {
  // Sort team members by completion rate (highest first)
  const sortedMembers = [...teamMembers].sort((a, b) => b.completionRate - a.completionRate);

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Team Member</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tasks</TableHead>
            <TableHead>Completion Rate</TableHead>
            <TableHead className="text-right">Performance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMembers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No team members found
              </TableCell>
            </TableRow>
          ) : (
            sortedMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>
                  {member.active !== false ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                      <XCircle className="mr-1 h-3 w-3" /> Inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {member.completedTasks} / {member.totalTasks}
                </TableCell>
                <TableCell>{member.completionRate}%</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Progress 
                      value={member.completionRate} 
                      className="w-[100px]" 
                      indicatorClassName={
                        member.completionRate < 30 
                          ? "bg-red-500" 
                          : member.completionRate < 70 
                            ? "bg-yellow-500" 
                            : "bg-green-500"
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}