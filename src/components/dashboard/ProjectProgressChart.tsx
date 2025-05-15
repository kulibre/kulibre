
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface ProjectProgressChartProps {
  data: ChartData[];
}

export function ProjectProgressChart({ data }: ProjectProgressChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{
              paddingLeft: "20px",
              fontSize: "12px"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
