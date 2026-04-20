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

const FIXED_COLORS: Record<string, string> = {
  rice: "#4CAF50",
  vegetables: "#FF9800",
  meat: "#F44336",
  fruits: "#9C27B0",
  others: "#2196F3",
};

const getCategoryColor = (type?: string) => {
  if (!type) return FIXED_COLORS.others;
  const t = type.toLowerCase();
  if (t === 'rice' || t.includes('rice')) return FIXED_COLORS.rice;
  if (t === 'vegetables' || t.includes('veg')) return FIXED_COLORS.vegetables;
  if (t === 'meat' || t.includes('meat')) return FIXED_COLORS.meat;
  if (t === 'fruits' || t.includes('fruit')) return FIXED_COLORS.fruits;
  return FIXED_COLORS.others;
};

export default function WasteOverviewChart({ wasteData }: WasteOverviewChartProps) {
  const chartData = useMemo(() => {
    const itemMap: Record<string, { value: number; fill: string }> = {};

    wasteData.forEach(entry => {
      if (entry.analysisDetails?.items && entry.analysisDetails.items.length > 0) {
        entry.analysisDetails.items.forEach(item => {
          const name = item.name;
          const grams = item.grams;
          const color = item.color;
          
          if (!itemMap[name]) {
            itemMap[name] = { value: 0, fill: color };
          }
          itemMap[name].value += grams;
        });
      } else {
        // Fallback for legacy data
        const fallbackType = entry.foodType || 'others';
        const quantityStr = entry.estimatedQuantity || '0g';
        const quantity = parseFloat(quantityStr.match(/(\d+(\.\d+)?)/)?.[0] || '0');
        if (!itemMap[fallbackType]) {
          itemMap[fallbackType] = { value: 0, fill: getCategoryColor(fallbackType) };
        }
        itemMap[fallbackType].value += quantity;
      }
    });

    return Object.entries(itemMap)
      .map(([name, data]) => ({ 
        name: name, 
        value: data.value, 
        fill: data.fill 
      }))
      .sort((a, b) => b.value - a.value);
  }, [wasteData]);

  const chartConfig = useMemo(() => {
    return chartData.reduce((acc, item) => {
      acc[item.name] = {
        label: item.name,
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
      <CardContent className="flex-1 flex items-center justify-center pb-6 min-w-0">
        {wasteData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto w-full max-h-[300px] aspect-square"
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
