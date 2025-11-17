import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

export default function Chart({ chartData }: { chartData: { name: string, count: number }[] }) {
    return (
        <ResponsiveContainer width="100%" height={150}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis width="auto"/>
                <Tooltip          
                    contentStyle={{ color: "light-dark(#000000, #000000)" }}
                    itemStyle={{ color: "light-dark(#000000, #000000)" }}
                    labelStyle={{ color: "light-dark(#000000, #000000)" }}
                    wrapperStyle={{ color: "light-dark(#000000, #000000)" }}
                />
                <Bar dataKey="count" fill="light-dark(#000000, #ffffff)" />
            </BarChart>
        </ResponsiveContainer>
    )
}