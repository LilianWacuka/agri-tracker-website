"use client";
import { Pie, PieChart,Cell,Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ExpensePieChartProps{
    data:{category:string, total:number}[],

}
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
export default function ExpensePieChart({data,}:ExpensePieChartProps){
    return(
        <div className= "h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="total"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                    >
                        {data.map((_, index) => (
                            <Cell 
                            key={`expensecell-${index}`}
                            fill={COLORS[index % COLORS.length]}  />
                        ))}
                    </Pie>
                    <Tooltip
                     formatter={(value)=>`ksh${Number(value).toLocaleString()}`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>

        </div>
    )
}
  