import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

// Color values matching CSS custom properties
const colors = {
  light: {
    text: '#000000',
    bg: '#e6e2d6',
  },
  dark: {
    text: '#e6e2d6',
    bg: '#000000',
  },
};

export default function Chart({
  chartData,
}: {
  chartData: { name: string; count: number }[];
}) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    try {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDark(mq.matches);

      const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } catch {
      // matchMedia not supported, default to light mode
    }
  }, []);

  const textColor = isDark ? colors.dark.text : colors.light.text;
  const bgColor = isDark ? colors.dark.bg : colors.light.bg;

  return (
    <ResponsiveContainer width="100%" height={150}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" tick={{ fill: textColor }} />
        <YAxis width="auto" tick={{ fill: textColor }} />
        <Tooltip
          contentStyle={{ backgroundColor: bgColor }}
          itemStyle={{ color: textColor }}
          labelStyle={{ color: textColor }}
        />
        <Bar dataKey="count" fill={textColor} />
      </BarChart>
    </ResponsiveContainer>
  );
}
