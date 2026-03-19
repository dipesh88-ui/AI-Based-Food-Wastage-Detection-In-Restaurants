'use client';

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { WasteData } from '@/lib/types';

interface WasteOverviewChartProps {
  wasteData: WasteData[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function WasteOverviewChart({ wasteData }: WasteOverviewChartProps) {
  const chartData = useMemo(() => {
    const dataMap = wasteData.reduce((acc, item) => {
      const quantity = parseFloat(item.estimatedQuantity.match(/(\d+(\.\d+)?)/)?.[0] || '0');
      if (!acc[item.foodType]) {
        acc[item.foodType] = 0;
      }
      acc[item.foodType] += quantity;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(dataMap).map(([name, value], index) => ({ name: name, value: value, fill: COLORS[index % COLORS.length] })).sort((a, b) => b.value - a.value);
  }, [wasteData]);

  const chartConfig = useMemo(() => {
    return chartData.reduce((acc, item) => {
      acc[item.name] = {
        label: item.name.charAt(0).toUpperCase() + item.name.slice(1),
        color: item.fill,
      };
      return acc;
    }, {} as any);
  }, [chartData]);
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Waste by Type</CardTitle>
        <CardDescription>Distribution of food waste by category (in grams).</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center pb-6">
        {wasteData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto w-full aspect-square"
          >
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    strokeWidth={5}
                  >
                    {chartData.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={entry.fill}
                        className="focus:outline-none"
                      />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="text-center text-muted-foreground">
            <p>No data to display.</p>
            <p className="text-sm">Log some waste to see the chart.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
