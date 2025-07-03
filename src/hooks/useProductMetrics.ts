import { useState, useEffect, useCallback } from "react";
import { metricsService, ProductMetrics } from "@/services/metricsService";

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

  const fetchProductMetrics = useCallback(async () => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));

      console.log(
        `🔍 Fetching product metrics - Period: ${period}, Start: ${
          startDate.toISOString().split("T")[0]
        }, End: ${endDate.toISOString().split("T")[0]}`
      );

      const productMetrics = await metricsService.getProductMetrics(
        period,
        startDate,
        endDate
      );

      console.log(`✅ Product metrics fetched successfully:`, productMetrics);

      setData({
        productMetrics,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("❌ Error fetching product metrics:", error);
      setData((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      }));
    }
  }, [period, startDate, endDate]);

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
