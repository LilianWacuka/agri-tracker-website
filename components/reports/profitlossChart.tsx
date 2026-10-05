"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ProfitLossChartProps {
  data: {
    month: string;
    income: number;
    expenses: number;
    profitLoss: number;
  }[];
}

export default function ProfitLossChart({
  data,
}: ProfitLossChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip
            formatter={(value) =>
              `KSh ${Number(value).toLocaleString()}`
            }
          />

          <Legend />

          <Line
            type="monotone"
            dataKey="profitLoss"
            name="Profit / Loss"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}