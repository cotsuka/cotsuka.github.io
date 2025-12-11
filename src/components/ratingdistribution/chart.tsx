import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function Chart({ chartData }: { chartData: { name: string, count: number }[] }) {
    return (
        <ResponsiveContainer width="100%" height={150}>
            <BarChart data={chartData}>
                <XAxis
                    dataKey="name"
                    tick={{ fill: "light-dark(#000000, #e6e2d6)" }}
                />
                <YAxis
                    width="auto"
                    tick={{ fill: "light-dark(#000000, #e6e2d6)" }}
                />
                <Tooltip          
                    contentStyle={{ backgroundColor: "light-dark(#000000, #e6e2d6)" }}
                    itemStyle={{ color: "light-dark(#e6e2d6, #000000)" }}
                    labelStyle={{ color: "light-dark(#e6e2d6, #000000)" }}
                />
                <Bar dataKey="count" fill="light-dark(#000000, #e6e2d6)" />
            </BarChart>
        </ResponsiveContainer>
    )
}