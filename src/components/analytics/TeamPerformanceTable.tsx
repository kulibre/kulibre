import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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

  // Function to get progress color
  const getProgressColor = (rate: number) => {
    if (rate < 30) return "bg-red-500";
    if (rate < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

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
                    <div className="w-[100px] relative h-2 overflow-hidden rounded-full bg-gray-100">
                      <div 
                        className={`absolute top-0 left-0 h-full ${getProgressColor(member.completionRate)}`}
                        style={{ width: `${member.completionRate}%` }}
                      />
                    </div>
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
