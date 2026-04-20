'use client';

import { useState, useEffect } from 'react';
import type { WasteData } from '@/lib/types';

const STORAGE_KEY = 'food-waste-logs';

export function useWasteData() {
  const [wasteData, setWasteData] = useState<WasteData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        setWasteData(JSON.parse(storedData));
      } catch (error) {
        console.error('Failed to parse waste data from localStorage:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const addWasteEntry = (entry: Omit<WasteData, 'id' | 'timestamp'>) => {
    const newEntry: WasteData = {
      ...entry,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
    };
    const updatedData = [newEntry, ...wasteData];
    setWasteData(updatedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    return newEntry;
  };

  const clearWasteData = () => {
    setWasteData([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    wasteData,
    isLoading,
    addWasteEntry,
    clearWasteData,
  };
}
