"use client";

import useSWR from "swr";
import { metricsService } from "@/services/metricsService";
import { SalesMetrics } from "@/types/metrics";
import { defaultConfig } from "@/lib/swr";

interface UseSalesMetricsProps {
  period: "day" | "week" | "month";
  startDate: Date;
  endDate: Date;
  refreshInterval?: number;
}

/**
 * SWR-based hook for sales metrics with automatic deduplication and caching
 */
export const useSalesMetrics = ({
  period,
  startDate,
  endDate,
  refreshInterval = 300000, // 5 minutes default
}: UseSalesMetricsProps) => {
  // Use timestamps for stable cache keys
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  const cacheKey = `metrics/sales/${period}/${startTime}/${endTime}`;

  const fetcher = async (): Promise<SalesMetrics> => {
    return metricsService.getSalesMetrics(
      period,
      new Date(startTime),
      new Date(endTime),
    );
  };

  const { data, error, isLoading, mutate } = useSWR<SalesMetrics>(
    cacheKey,
    fetcher,
    {
      ...defaultConfig,
      refreshInterval,
    },
  );

  return {
    salesMetrics: data ?? null,
    loading: isLoading,
    error: error?.message ?? null,
    refetch: () => mutate(),
  };
};
