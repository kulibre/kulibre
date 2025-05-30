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
    <div className="h-[300px] w-full p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={processedData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 20,
          }}
          barSize={20}
          barGap={4}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#f3f4f6" 
            strokeWidth={1}
          />
          <XAxis
            dataKey="name"
            scale="point"
            padding={{ left: 40, right: 40 }}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickFormatter={(value) => value.length > 12 ? `${value.substring(0, 12)}...` : value}
            stroke="#e5e7eb"
            axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#6b7280" }}
            stroke="#e5e7eb"
            axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
            tickLine={false}
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === "Total Tasks") return [value, "Total Tasks"];
              if (name === "Completed") return [value, "Completed Tasks"];
              return [value, name];
            }}
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              padding: "8px 12px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
            cursor={{ fill: "rgba(0, 0, 0, 0.02)" }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: "8px",
            }}
            iconType="circle"
            iconSize={8}
          />
          <Bar
            dataKey="tasks"
            fill="#8b5cf6"
            radius={[4, 4, 0, 0]}
            name="Total Tasks"
            stackId="a"
          />
          <Bar
            dataKey="completed"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            name="Completed"
            stackId="b"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
