
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface TeamMember {
  name: string;
  tasks: number;
  completed?: number;
  max: number;
  active?: boolean;
}

interface TeamWorkloadChartProps {
  data: TeamMember[];
}

export function TeamWorkloadChart({ data }: TeamWorkloadChartProps) {
  // Process data to ensure it has the right format
  const processedData = data.map(item => ({
    ...item,
    name: item.name || "Unnamed",
    tasks: item.tasks || 0,
    completed: item.completed || 0,
    active: item.active !== undefined ? item.active : true,
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={processedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            scale="point"
            padding={{ left: 10, right: 10 }}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
          />
          <YAxis />
          <Tooltip
            formatter={(value, name) => {
              if (name === "Total Tasks") return [value, "Total Tasks"];
              if (name === "Completed") return [value, "Completed Tasks"];
              return [value, name];
            }}
          />
          <Legend />
          <Bar
            dataKey="tasks"
            fill="#9b87f5"
            radius={[4, 4, 0, 0]}
            name="Total Tasks"
            stackId="a"
          />
          <Bar
            dataKey="completed"
            fill="#4ade80"
            radius={[4, 4, 0, 0]}
            name="Completed"
            stackId="b"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
