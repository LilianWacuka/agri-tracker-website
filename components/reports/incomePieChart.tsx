"use client";
import { Pie, PieChart,Cell,Tooltip, ResponsiveContainer, Legend } from "recharts";

interface IncomePieChartProps{
    data:{category:string, total:number}[],

}
const COLORS = ['#ac21df', '#3a4e4b', '#dba83a', '#FF8042', '#7a73fb'];
export default function IncomePieChart({data,}:IncomePieChartProps){
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
                            key={`incomecell-${index}`}
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
  