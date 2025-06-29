import { useState, useEffect, useCallback } from "react";
import { metricsService, TableMetrics } from "@/services/metricsService";

export const useTableMetrics = (refreshInterval: number = 60000) => {
  const [data, setData] = useState<{
    tableMetrics: TableMetrics | null;
    loading: boolean;
    error: string | null;
  }>({
    tableMetrics: null,
    loading: true,
    error: null,
  });

  const fetchTableMetrics = useCallback(async () => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));

      const tableMetrics = await metricsService.getTableMetrics();

      setData({
        tableMetrics,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching table metrics:", error);
      setData((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      }));
    }
  }, []);

  const refetch = useCallback(() => {
    fetchTableMetrics();
  }, [fetchTableMetrics]);

  useEffect(() => {
    fetchTableMetrics();

    // Set up polling
    const interval = setInterval(fetchTableMetrics, refreshInterval);

    return () => clearInterval(interval);
  }, [fetchTableMetrics, refreshInterval]);

  return {
    ...data,
    refetch,
  };
};
