import { useState, useEffect, useCallback } from "react";
import { metricsService } from "@/services/metricsService";
import { SalesMetrics } from "@/types/metrics";

interface UseSalesMetricsProps {
  period: "day" | "week" | "month";
  startDate: Date;
  endDate: Date;
  refreshInterval?: number;
}

export const useSalesMetrics = ({
  period,
  startDate,
  endDate,
  refreshInterval = 300000, // 5 minutes default
}: UseSalesMetricsProps) => {
  const [data, setData] = useState<{
    salesMetrics: SalesMetrics | null;
    loading: boolean;
    error: string | null;
  }>({
    salesMetrics: null,
    loading: true,
    error: null,
  });

  // Use timestamps for stable dependencies
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();

  const fetchSalesMetrics = useCallback(async () => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));

      const salesMetrics = await metricsService.getSalesMetrics(
        period,
        new Date(startTime),
        new Date(endTime),
      );

      setData({
        salesMetrics,
        loading: false,
        error: null,
      });
    } catch (error) {
      setData((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      }));
    }
  }, [period, startTime, endTime]);

  const refetch = useCallback(() => {
    fetchSalesMetrics();
  }, [fetchSalesMetrics]);

  useEffect(() => {
    fetchSalesMetrics();

    // Set up polling
    const interval = setInterval(() => {
      fetchSalesMetrics();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [fetchSalesMetrics, refreshInterval]);

  return {
    salesMetrics: data.salesMetrics,
    loading: data.loading,
    error: data.error,
    refetch,
  };
};
