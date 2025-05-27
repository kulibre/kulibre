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
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={processedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
          barSize={30}
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            scale="point"
            padding={{ left: 20, right: 20 }}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickFormatter={(value) => value.length > 12 ? `${value.substring(0, 12)}...` : value}
            stroke="#e5e7eb"
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#6b7280" }}
            stroke="#e5e7eb"
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
            }}
            cursor={{ fill: "rgba(0, 0, 0, 0.04)" }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: "12px",
            }}
          />
          <Bar
            dataKey="tasks"
            fill="#9b87f5"
            radius={[6, 6, 0, 0]}
            name="Total Tasks"
            stackId="a"
          />
          <Bar
            dataKey="completed"
            fill="#4ade80"
            radius={[6, 6, 0, 0]}
            name="Completed"
            stackId="b"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
