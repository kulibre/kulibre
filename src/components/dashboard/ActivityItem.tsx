import { formatDistanceToNow } from "date-fns";
import { 
  CheckCircle2, 
  FileEdit, 
  MessageSquare, 
  Plus, 
  UserPlus, 
  Calendar, 
  Pencil,
  FileText,
  AlertCircle
} from "lucide-react";

export interface ActivityLogItem {
  id: string;
  user_id: string;
  action_type: string;
  entity_type: string;
  entity_id: string;
  description: string;
  metadata: Record<string, any>;
  created_at: string;
  user?: {
    full_name?: string;
  };
}

interface ActivityItemProps {
  activity: ActivityLogItem;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  // Function to determine the icon based on action type
  const getActivityIcon = () => {
    switch (activity.action_type) {
      case 'task_created':
        return <Plus className="h-4 w-4" />;
      case 'task_completed':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'project_updated':
        return <FileEdit className="h-4 w-4" />;
      case 'comment_added':
        return <MessageSquare className="h-4 w-4" />;
      case 'team_member_added':
        return <UserPlus className="h-4 w-4" />;
      case 'event_created':
        return <Calendar className="h-4 w-4" />;
      case 'task_updated':
        return <Pencil className="h-4 w-4" />;
      case 'file_uploaded':
        return <FileText className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Function to determine the background color based on action type
  const getActivityColor = () => {
    switch (activity.action_type) {
      case 'task_created':
        return "bg-blue-100 text-blue-700";
      case 'task_completed':
        return "bg-green-100 text-green-700";
      case 'project_updated':
        return "bg-purple-100 text-purple-700";
      case 'comment_added':
        return "bg-yellow-100 text-yellow-700";
      case 'team_member_added':
        return "bg-indigo-100 text-indigo-700";
      case 'event_created':
        return "bg-pink-100 text-pink-700";
      case 'task_updated':
        return "bg-orange-100 text-orange-700";
      case 'file_uploaded':
        return "bg-teal-100 text-teal-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex items-start gap-4 py-3">
      <div className={`rounded-full p-2 ${getActivityColor()}`}>
        {getActivityIcon()}
      </div>
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-medium">
            {activity.user?.full_name || "A user"}
          </span>{" "}
          {activity.description}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {activity.created_at && formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}
