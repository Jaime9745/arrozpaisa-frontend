import { useState, useEffect, useCallback } from "react";
import { metricsService, SalesMetrics } from "@/services/metricsService";

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

  const fetchSalesMetrics = useCallback(async () => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));

      console.log(
        `🔍 Fetching sales metrics - Period: ${period}, Start: ${
          startDate.toISOString().split("T")[0]
        }, End: ${endDate.toISOString().split("T")[0]}`
      );

      const salesMetrics = await metricsService.getSalesMetrics(
        period,
        startDate,
        endDate
      );

      console.log(`✅ Sales metrics fetched successfully:`, salesMetrics);

      setData({
        salesMetrics,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("❌ Error fetching sales metrics:", error);
      setData((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      }));
    }
  }, [period, startDate, endDate]);

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
