"use client";

import useSWR from "swr";
import { metricsService } from "@/services/metricsService";
import { MostSoldProduct } from "@/types/metrics";
import { defaultConfig } from "@/lib/swr";

interface UseMostSoldProductParams {
  startDate: Date;
  endDate: Date;
  enabled?: boolean;
}

interface UseMostSoldProductReturn {
  mostSoldProduct: MostSoldProduct | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * SWR-based hook for most sold product with automatic deduplication and caching
 */
export function useMostSoldProduct({
  startDate,
  endDate,
  enabled = true,
}: UseMostSoldProductParams): UseMostSoldProductReturn {
  // Use timestamps for stable cache keys
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  // Use null key to disable fetching when not enabled
  const cacheKey = enabled
    ? `metrics/most-sold-product/${startTime}/${endTime}`
    : null;

  const fetcher = async (): Promise<MostSoldProduct> => {
    return metricsService.getMostSoldProduct(
      new Date(startTime),
      new Date(endTime),
    );
  };

  const { data, error, isLoading, mutate } = useSWR<MostSoldProduct>(
    cacheKey,
    fetcher,
    defaultConfig,
  );

  return {
    mostSoldProduct: data ?? null,
    loading: isLoading,
    error: error?.message ?? null,
    refetch: async () => {
      await mutate();
    },
  };
}
