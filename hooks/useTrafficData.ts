"use client";

import { useState, useEffect, useCallback } from "react";
import { REFRESH_INTERVALS } from "@/lib/constants";

interface TrafficDataPoint {
  id: string;
  timestamp: Date;
  congestion: number;
  speed: number;
  volume: number;
  incidents: number;
}

interface UseTrafficDataReturn {
  data: TrafficDataPoint[];
  isLoading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

export function useTrafficData(
  refreshInterval: number = REFRESH_INTERVALS.trafficData
): UseTrafficDataReturn {
  const [data, setData] = useState<TrafficDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Generate simulated traffic data
  const generateTrafficData = useCallback((): TrafficDataPoint[] => {
    const now = new Date();
    const dataPoints: TrafficDataPoint[] = [];

    // Generate data for the last 24 hours
    for (let i = 0; i < 24; i++) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hour = timestamp.getHours();

      // Simulate rush hour patterns
      const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18);
      const baseCongestion = isRushHour ? 60 : 30;

      dataPoints.push({
        id: `data-${i}`,
        timestamp,
        congestion: baseCongestion + Math.random() * 30,
        speed: isRushHour ? 20 + Math.random() * 15 : 35 + Math.random() * 20,
        volume: isRushHour ? 800 + Math.random() * 400 : 300 + Math.random() * 200,
        incidents: Math.floor(Math.random() * (isRushHour ? 5 : 2)),
      });
    }

    return dataPoints.reverse();
  }, []);

  // Fetch/refresh data
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newData = generateTrafficData();
      setData(newData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch traffic data"));
    } finally {
      setIsLoading(false);
    }
  }, [generateTrafficData]);

  // Initial load
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refresh, refreshInterval]);

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    refresh,
  };
}
