"use client";

import useSWR from "swr";
import { metricsService } from "@/services/metricsService";
import { HourlyFlowMetrics } from "@/types/metrics";
import { defaultConfig } from "@/lib/swr";

interface UseHourlyFlowMetricsProps {
  startDate?: Date;
  endDate?: Date;
  refreshInterval?: number;
}

/**
 * SWR-based hook for hourly flow metrics with automatic deduplication and caching
 */
export const useHourlyFlowMetrics = ({
  startDate,
  endDate,
  refreshInterval = 300000, // 5 minutes default
}: UseHourlyFlowMetricsProps = {}) => {
  // Use default dates if not provided (last 7 days)
  const effectiveStartDate =
    startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const effectiveEndDate = endDate || new Date();

  // Use timestamps for stable cache keys
  const startTime = effectiveStartDate.getTime();
  const endTime = effectiveEndDate.getTime();
  const cacheKey = `metrics/hourly-flow/${startTime}/${endTime}`;

  const fetcher = async (): Promise<HourlyFlowMetrics> => {
    return metricsService.getHourlyFlowMetrics(
      new Date(startTime),
      new Date(endTime),
    );
  };

  const { data, error, isLoading, mutate } = useSWR<HourlyFlowMetrics>(
    cacheKey,
    fetcher,
    {
      ...defaultConfig,
      refreshInterval,
    },
  );

  return {
    hourlyFlowMetrics: data ?? null,
    loading: isLoading,
    error: error?.message ?? null,
    refetch: () => mutate(),
  };
};
