import { useState, useEffect, useCallback } from "react";
import { metricsService } from "@/services/metricsService";
import { ProductMetrics } from "@/types/metrics";

interface UseProductMetricsProps {
  period: "week" | "month";
  startDate: Date;
  endDate: Date;
  refreshInterval?: number;
}

export const useProductMetrics = ({
  period,
  startDate,
  endDate,
  refreshInterval = 300000, // 5 minutes default
}: UseProductMetricsProps) => {
  const [data, setData] = useState<{
    productMetrics: ProductMetrics | null;
    loading: boolean;
    error: string | null;
  }>({
    productMetrics: null,
    loading: true,
    error: null,
  });

  // Use timestamps for stable dependencies
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();

  const fetchProductMetrics = useCallback(async () => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));

      const productMetrics = await metricsService.getProductMetrics(
        period,
        new Date(startTime),
        new Date(endTime),
      );

      setData({
        productMetrics,
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
    fetchProductMetrics();
  }, [fetchProductMetrics]);

  useEffect(() => {
    fetchProductMetrics();

    // Set up polling
    const interval = setInterval(() => {
      fetchProductMetrics();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [fetchProductMetrics, refreshInterval]);

  return {
    productMetrics: data.productMetrics,
    loading: data.loading,
    error: data.error,
    refetch,
  };
};
