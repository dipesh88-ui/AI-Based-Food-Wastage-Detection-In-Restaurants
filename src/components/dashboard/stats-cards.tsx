'use client';

import React, {useMemo, useState} from 'react';
import {Package, Scale, ChefHat} from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import type {WasteData} from '@/lib/types';
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {isThisMonth, isThisWeek, isToday, parseISO} from 'date-fns';

interface StatsCardsProps {
  wasteData: WasteData[];
}

type Period = 'day' | 'week' | 'month' | 'all';

export default function StatsCards({wasteData}: StatsCardsProps) {
  const [period, setPeriod] = useState<Period>('all');

  const stats = useMemo(() => {
    const dataToFilter = period === 'all' ? wasteData : wasteData.filter(item => {
      const date = parseISO(item.timestamp);
      if (period === 'day') return isToday(date);
      if (period === 'week') return isThisWeek(date, {weekStartsOn: 1});
      if (period === 'month') return isThisMonth(date);
      return true; // Should not happen with 'all' handled separately
    });

    const totalEntries = dataToFilter.length;
    const totalQuantity = dataToFilter.reduce((acc, item) => {
      const quantityMatch = item.estimatedQuantity.match(/(\d+)/);
      return acc + (quantityMatch ? parseFloat(quantityMatch[0]) : 0);
    }, 0);

    const foodTypeQuantities = dataToFilter.reduce((acc, item) => {
      const quantity = parseFloat(
        item.estimatedQuantity.match(/(\d+(\.\d+)?)/)?.[0] || '0'
      );
      acc[item.foodType] = (acc[item.foodType] || 0) + quantity;
      return acc;
    }, {} as Record<string, number>);

    const mostWastedFoodType =
      Object.keys(foodTypeQuantities).length > 0
        ? Object.entries(foodTypeQuantities).sort((a, b) => b[1] - a[1])[0][0]
        : 'N/A';

    return {totalEntries, totalQuantity, mostWastedFoodType};
  }, [wasteData, period]);

  const periodText = useMemo(() => {
    switch(period) {
      case 'day': return 'today';
      case 'week': return 'this week';
      case 'month': return 'this month';
      default: return 'all time';
    }
  }, [period]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEntries}</div>
          <p className="text-xs text-muted-foreground">waste logs recorded ({periodText})</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Waste</CardTitle>
          <Scale className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalQuantity.toFixed(0)}g
          </div>
          <Tabs
            defaultValue="all"
            onValueChange={value => setPeriod(value as Period)}
            className="w-full mt-1"
          >
            <TabsList className="grid w-full grid-cols-4 h-7 text-xs">
              <TabsTrigger value="day" className="p-1 h-full">
                Day
              </TabsTrigger>
              <TabsTrigger value="week" className="p-1 h-full">
                Week
              </TabsTrigger>
              <TabsTrigger value="month" className="p-1 h-full">
                Month
              </TabsTrigger>
              <TabsTrigger value="all" className="p-1 h-full">
                All
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Waste Item</CardTitle>
          <ChefHat className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">
            {stats.mostWastedFoodType}
          </div>
          <p className="text-xs text-muted-foreground">
            most wasted item by quantity ({periodText})
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
