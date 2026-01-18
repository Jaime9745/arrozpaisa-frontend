"use client";

import useSWR from "swr";
import { metricsService } from "@/services/metricsService";
import { LeastSoldProduct } from "@/types/metrics";
import { defaultConfig } from "@/lib/swr";

interface UseLeastSoldProductParams {
  startDate: Date;
  endDate: Date;
  enabled?: boolean;
}

interface UseLeastSoldProductReturn {
  leastSoldProduct: LeastSoldProduct | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * SWR-based hook for least sold product with automatic deduplication and caching
 */
export function useLeastSoldProduct({
  startDate,
  endDate,
  enabled = true,
}: UseLeastSoldProductParams): UseLeastSoldProductReturn {
  // Use timestamps for stable cache keys
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  // Use null key to disable fetching when not enabled
  const cacheKey = enabled
    ? `metrics/least-sold-product/${startTime}/${endTime}`
    : null;

  const fetcher = async (): Promise<LeastSoldProduct> => {
    return metricsService.getLeastSoldProduct(
      new Date(startTime),
      new Date(endTime),
    );
  };

  const { data, error, isLoading, mutate } = useSWR<LeastSoldProduct>(
    cacheKey,
    fetcher,
    defaultConfig,
  );

  return {
    leastSoldProduct: data ?? null,
    loading: isLoading,
    error: error?.message ?? null,
    refetch: async () => {
      await mutate();
    },
  };
}
