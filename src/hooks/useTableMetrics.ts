"use client";

import useSWR from "swr";
import { metricsService } from "@/services/metricsService";
import { TableMetrics } from "@/types/metrics";
import { realtimeConfig } from "@/lib/swr";

const TABLE_METRICS_KEY = "metrics/tables";

/**
 * SWR-based hook for table metrics with automatic deduplication and caching
 * Uses real-time config for frequent updates
 */
export const useTableMetrics = (refreshInterval: number = 60000) => {
  const fetcher = async (): Promise<TableMetrics> => {
    return metricsService.getTableMetrics();
  };

  const { data, error, isLoading, mutate } = useSWR<TableMetrics>(
    TABLE_METRICS_KEY,
    fetcher,
    {
      ...realtimeConfig,
      refreshInterval,
    },
  );

  return {
    tableMetrics: data ?? null,
    loading: isLoading,
    error: error?.message ?? null,
    refetch: () => mutate(),
  };
};
