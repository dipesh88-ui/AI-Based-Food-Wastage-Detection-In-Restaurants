'use client';

import React from 'react';
import { useWasteData } from '@/hooks/use-waste-data';
import ImageUploadForm from '@/components/dashboard/image-upload-form';
import WasteLogTable from '@/components/dashboard/waste-log-table';
import StatsCards from '@/components/dashboard/stats-cards';
import WasteOverviewChart from '@/components/dashboard/waste-overview-chart';
import { Skeleton } from '@/components/ui/skeleton';
import WasteTrendsChart from '@/components/dashboard/waste-trends-chart';

export default function DashboardPage() {
  const { wasteData, addWasteEntry, isLoaded, clearWasteData } = useWasteData();

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="h-[400px] col-span-4" />
          <Skeleton className="h-[400px] col-span-3" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }
  
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Dashboard</h1>
      </div>
      <div className="flex flex-1 rounded-lg shadow-sm" >
        <div className="w-full space-y-6">
          <StatsCards wasteData={wasteData} />
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <ImageUploadForm onWasteAdd={addWasteEntry} />
            </div>
            <div className="lg:col-span-3">
               <WasteTrendsChart wasteData={wasteData} />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
                <WasteOverviewChart wasteData={wasteData} />
            </div>
             <div className="lg:col-span-3">
              <WasteLogTable wasteData={wasteData} clearWasteData={clearWasteData}/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
