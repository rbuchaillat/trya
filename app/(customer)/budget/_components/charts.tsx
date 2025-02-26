"use client";

import { PieChart, Pie, Cell, PieLabel } from "recharts";
import useIsMounted from "@/hooks/use-is-mounted";
import { ICONS } from "@/features/category/category.constant";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Charts = ({ data, colors }: { data: any[]; colors: string[] }) => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  const renderCustomizedLabel: PieLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    if (percent * 100 < 5) return;

    const Icon = ICONS[data[index].name];

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <foreignObject x={x - 9} y={y - 9} width={18} height={18}>
        <Icon width={18} height={18} color="white" />
      </foreignObject>
    );
  };

  return (
    <PieChart width={200} height={200}>
      <Pie
        data={data}
        cx={95}
        cy={95}
        innerRadius={50}
        outerRadius={90}
        fill="#8884d8"
        dataKey="value"
        label={renderCustomizedLabel}
        labelLine={false}
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
    </PieChart>
  );
};
