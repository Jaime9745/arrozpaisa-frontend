"use client";

import useSWR from "swr";
import { metricsService } from "@/services/metricsService";
import { ProductMetrics } from "@/types/metrics";
import { defaultConfig } from "@/lib/swr";

interface UseProductMetricsProps {
  period: "week" | "month";
  startDate: Date;
  endDate: Date;
  refreshInterval?: number;
}

/**
 * SWR-based hook for product metrics with automatic deduplication and caching
 */
export const useProductMetrics = ({
  period,
  startDate,
  endDate,
  refreshInterval = 300000, // 5 minutes default
}: UseProductMetricsProps) => {
  // Use timestamps for stable cache keys
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  const cacheKey = `metrics/products/${period}/${startTime}/${endTime}`;

  const fetcher = async (): Promise<ProductMetrics> => {
    return metricsService.getProductMetrics(
      period,
      new Date(startTime),
      new Date(endTime),
    );
  };

  const { data, error, isLoading, mutate } = useSWR<ProductMetrics>(
    cacheKey,
    fetcher,
    {
      ...defaultConfig,
      refreshInterval,
    },
  );

  return {
    productMetrics: data ?? null,
    loading: isLoading,
    error: error?.message ?? null,
    refetch: () => mutate(),
  };
};
