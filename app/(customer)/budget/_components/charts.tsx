"use client";

import { PieChart, Pie, Cell } from "recharts";
import useIsMounted from "@/hooks/use-is-mounted";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Charts = ({ data, colors }: { data: any[]; colors: string[] }) => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <PieChart width={200} height={200}>
      <Pie
        data={data}
        cx={95}
        cy={95}
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="value"
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
    </PieChart>
  );
};
