
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
  bgColor?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  className,
  bgColor = "bg-white",
}: StatCardProps) {
  return (
    <div className={cn(
      "rounded-xl p-6 border card-hover", 
      bgColor,
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={cn(
                  "text-xs font-medium",
                  trend === "up" && "text-green-600",
                  trend === "down" && "text-red-600",
                  trend === "neutral" && "text-yellow-600"
                )}
              >
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className="rounded-full p-2 bg-creatively-purple/10 text-creatively-purple">
          {icon}
        </div>
      </div>
    </div>
  );
}
