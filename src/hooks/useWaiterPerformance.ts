"use client";

import useSWR from "swr";
import { metricsService } from "@/services/metricsService";
import { WaiterPerformance } from "@/types/metrics";
import { defaultConfig } from "@/lib/swr";

interface UseWaiterPerformanceOptions {
  startDate: Date;
  endDate: Date;
  enabled?: boolean;
}

interface UseWaiterPerformanceReturn {
  waiterPerformance: WaiterPerformance[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * SWR-based hook for waiter performance with automatic deduplication and caching
 */
export function useWaiterPerformance({
  startDate,
  endDate,
  enabled = true,
}: UseWaiterPerformanceOptions): UseWaiterPerformanceReturn {
  // Use timestamps for stable cache keys
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  // Use null key to disable fetching when not enabled
  const cacheKey = enabled
    ? `metrics/waiter-performance/${startTime}/${endTime}`
    : null;

  const fetcher = async (): Promise<WaiterPerformance[]> => {
    return metricsService.getAllWaitersPerformance(
      new Date(startTime),
      new Date(endTime),
    );
  };

  const { data, error, isLoading, mutate } = useSWR<WaiterPerformance[]>(
    cacheKey,
    fetcher,
    defaultConfig,
  );

  return {
    waiterPerformance: data ?? [],
    loading: isLoading,
    error: error?.message ?? null,
    refetch: async () => {
      await mutate();
    },
  };
}
