'use client';

import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { WasteData } from '@/lib/types';
import { format, parseISO, startOfWeek, startOfMonth } from 'date-fns';

interface WasteTrendsChartProps {
  wasteData: WasteData[];
}

type Period = 'daily' | 'weekly' | 'monthly';

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function WasteTrendsChart({ wasteData }: WasteTrendsChartProps) {
  const [period, setPeriod] = useState<Period>('daily');

  const { chartData, foodTypes } = useMemo(() => {
    const dataMap = new Map<string, Record<string, number>>();
    const allFoodTypes = new Set<string>();

    wasteData.forEach(item => {
      allFoodTypes.add(item.foodType);
      const date = parseISO(item.timestamp);
      const quantity = parseFloat(item.estimatedQuantity.match(/(\d+(\.\d+)?)/)?.[0] || '0');
      let key: string;

      if (period === 'daily') {
        key = format(date, 'MMM d');
      } else if (period === 'weekly') {
        key = format(startOfWeek(date, { weekStartsOn: 1 }), 'MMM d');
      } else { // monthly
        key = format(startOfMonth(date), 'MMM yyyy');
      }

      if (!dataMap.has(key)) {
        dataMap.set(key, {});
      }
      
      const periodData = dataMap.get(key)!;
      periodData[item.foodType] = (periodData[item.foodType] || 0) + quantity;
    });
    
    const sortedData = Array.from(dataMap.entries()).map(([name, quantities]) => ({ name, ...quantities }));
    
    // a simple sort for dates
    try {
        if (period === 'daily' || period === 'weekly') {
            return { 
                chartData: sortedData.sort((a,b) => new Date(a.name).getTime() - new Date(b.name).getTime()),
                foodTypes: Array.from(allFoodTypes)
            };
        }
    }
    catch(e) {
        // if date parsing fails, just return unsorted.
         return { chartData: sortedData, foodTypes: Array.from(allFoodTypes) };
    }

    return { chartData: sortedData, foodTypes: Array.from(allFoodTypes) };

  }, [wasteData, period]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Waste Trends</CardTitle>
                <CardDescription>Total waste quantity (in grams) over time by food type.</CardDescription>
            </div>
            <Tabs value={period} onValueChange={(value) => setPeriod(value as Period)} className="w-auto">
                <TabsList>
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center pb-6">
        {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}g`} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  contentStyle={{
                      background: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                  }}
                />
                <Legend />
                {foodTypes.map((foodType, index) => (
                    <Bar 
                        key={foodType} 
                        dataKey={foodType} 
                        stackId="a" 
                        fill={COLORS[index % COLORS.length]} 
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                    />
                ))}
              </BarChart>
            </ResponsiveContainer>
        ) : (
          <div className="text-center text-muted-foreground">
            <p>Not enough data to display trends.</p>
            <p className="text-sm">Log more waste over time to see trends.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
