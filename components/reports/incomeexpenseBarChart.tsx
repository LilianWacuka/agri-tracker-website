"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
interface IncomeExpenseBarChartProps{
    data:{
        month: string;
        income: number;
        expenses: number;
        profitLoss: number;
    }[];
}
export default function IncomeExpenseChart({data}:IncomeExpenseBarChartProps){
    return(
        <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                    formatter={(value) => `KSh ${Number(value).toLocaleString()}`}/>
                    <Legend />
                    <Bar dataKey="income" fill="#3F292D" name="Income"/>
                    <Bar dataKey="expenses" fill="#A78B5B" name="Expenses"/>
                    <Bar dataKey="profitLoss" fill="#E5DCC1" name="Profit/Loss"/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}