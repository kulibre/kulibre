import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ActivityData {
  date: string;
  created: number;
  completed: number;
}

interface ActivityTrendChartProps {
  data: ActivityData[];
}

export function ActivityTrendChart({ data }: ActivityTrendChartProps) {
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={formatDate} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="created" stroke="#8884d8" name="Tasks Created" />
          <Line type="monotone" dataKey="completed" stroke="#82ca9d" name="Tasks Completed" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
         