import { useState, useEffect, useCallback } from "react";
import { metricsService } from "@/services/metricsService";
import { HourlyFlowMetrics } from "@/types/metrics";

interface UseHourlyFlowMetricsProps {
  startDate?: Date;
  endDate?: Date;
  refreshInterval?: number;
}

export const useHourlyFlowMetrics = ({
  startDate,
  endDate,
  refreshInterval = 300000, // 5 minutes default
}: UseHourlyFlowMetricsProps = {}) => {
  const [data, setData] = useState<{
    hourlyFlowMetrics: HourlyFlowMetrics | null;
    loading: boolean;
    error: string | null;
  }>({
    hourlyFlowMetrics: null,
    loading: true,
    error: null,
  });

  const fetchHourlyFlowMetrics = useCallback(async () => {
    // Use default dates if not provided (last 7 days)
    const effectiveStartDate =
      startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const effectiveEndDate = endDate || new Date();

    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));

      const hourlyFlowMetrics = await metricsService.getHourlyFlowMetrics(
        effectiveStartDate,
        effectiveEndDate
      );

      setData({
        hourlyFlowMetrics,
        loading: false,
        error: null,
      });
    } catch (error) {
      setData((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Error al obtener métricas de flujo horario",
      }));
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchHourlyFlowMetrics();

    const interval = setInterval(fetchHourlyFlowMetrics, refreshInterval);

    return () => clearInterval(interval);
  }, [fetchHourlyFlowMetrics, refreshInterval]);

  return {
    ...data,
    refetch: fetchHourlyFlowMetrics,
  };
};
