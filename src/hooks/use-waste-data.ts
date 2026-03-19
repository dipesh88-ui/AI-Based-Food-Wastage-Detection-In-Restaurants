'use client';

import { useState, useEffect, useCallback } from 'react';
import type { WasteData } from '@/lib/types';

const STORAGE_KEY = 'foodWastageData';

export function useWasteData() {
  const [wasteData, setWasteData] = useState<WasteData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedData = window.localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        setWasteData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Failed to load waste data from local storage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wasteData));
      } catch (error) {
        console.error('Failed to save waste data to local storage:', error);
      }
    }
  }, [wasteData, isLoaded]);

  const addWasteEntry = useCallback((entry: Omit<WasteData, 'id' | 'timestamp'>) => {
    const newEntry: WasteData = {
      ...entry,
      id: new Date().toISOString() + Math.random(),
      timestamp: new Date().toISOString(),
    };
    setWasteData((prevData) => [newEntry, ...prevData]);
  }, []);
  
  const clearWasteData = useCallback(() => {
    setWasteData([]);
  }, []);

  return { wasteData, addWasteEntry, isLoaded, clearWasteData };
}
