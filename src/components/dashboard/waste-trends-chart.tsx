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

export default function WasteTrendsChart({ wasteData }: WasteTrendsChartProps) {
  const [period, setPeriod] = useState<Period>('daily');

  const { chartData, foodTypes, colorMap } = useMemo(() => {
    const dataMap = new Map<string, Record<string, number>>();
    const allFoodTypes = new Set<string>();
    const typeToColor = new Map<string, string>();

    wasteData.forEach(item => {
      const date = parseISO(item.timestamp);
      let periodKey: string;

      if (period === 'daily') {
        periodKey = format(date, 'MMM d');
      } else if (period === 'weekly') {
        periodKey = format(startOfWeek(date, { weekStartsOn: 1 }), 'MMM d');
      } else { // monthly
        periodKey = format(startOfMonth(date), 'MMM yyyy');
      }

      if (!dataMap.has(periodKey)) {
        dataMap.set(periodKey, {});
      }
      
      const periodData = dataMap.get(periodKey)!;

      if (item.analysisDetails?.items && item.analysisDetails.items.length > 0) {
        item.analysisDetails.items.forEach(foodItem => {
          allFoodTypes.add(foodItem.name);
          typeToColor.set(foodItem.name, foodItem.color);
          periodData[foodItem.name] = (periodData[foodItem.name] || 0) + foodItem.grams;
        });
      } else {
        // Fallback for legacy data
        const fallbackType = item.foodType || 'others';
        allFoodTypes.add(fallbackType);
        typeToColor.set(fallbackType, getCategoryColor(fallbackType));
        const quantityStr = item.estimatedQuantity || '0g';
        const quantity = parseFloat(quantityStr.match(/(\d+(\.\d+)?)/)?.[0] || '0');
        periodData[fallbackType] = (periodData[fallbackType] || 0) + quantity;
      }
    });
    
    const sortedData = Array.from(dataMap.entries()).map(([name, quantities]) => ({ name, ...quantities }));
    
    try {
        if (period === 'daily' || period === 'weekly') {
            sortedData.sort((a,b) => new Date(a.name).getTime() - new Date(b.name).getTime());
        }
    } catch(e) {
         // Silently fail if date sorting is complex
    }

    return { 
      chartData: sortedData, 
      foodTypes: Array.from(allFoodTypes),
      colorMap: Object.fromEntries(typeToColor)
    };
  }, [wasteData, period]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <CardTitle>Waste Trends</CardTitle>
                <CardDescription>Total waste quantity (in grams) over time by food type.</CardDescription>
            </div>
            <Tabs value={period} onValueChange={(value) => setPeriod(value as Period)} className="w-full sm:w-auto">
                <TabsList className="grid w-full grid-cols-3 sm:flex sm:w-auto">
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center pb-6 min-w-0">
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
                        fill={colorMap[foodType] || getCategoryColor(foodType)} 
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
