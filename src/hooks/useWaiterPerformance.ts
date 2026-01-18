import { useState, useEffect, useCallback } from "react";
import { metricsService } from "@/services/metricsService";
import { WaiterPerformance } from "@/types/metrics";

interface UseWaiterPerformanceOptions {
  startDate: Date;
  endDate: Date;
  enabled?: boolean;
}

interface UseWaiterPerformanceReturn {
  waiterPerformance: WaiterPerformance[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useWaiterPerformance({
  startDate,
  endDate,
  enabled = true,
}: UseWaiterPerformanceOptions): UseWaiterPerformanceReturn {
  const [waiterPerformance, setWaiterPerformance] = useState<
    WaiterPerformance[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use timestamps for stable dependencies
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();

  const fetchWaiterPerformance = useCallback(async () => {
    if (!enabled) {
      setWaiterPerformance([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await metricsService.getAllWaitersPerformance(
        new Date(startTime),
        new Date(endTime),
      );
      setWaiterPerformance(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error fetching waiter performance";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [startTime, endTime, enabled]);

  const refetch = useCallback(async () => {
    await fetchWaiterPerformance();
  }, [fetchWaiterPerformance]);

  useEffect(() => {
    fetchWaiterPerformance();
  }, [fetchWaiterPerformance]);

  return {
    waiterPerformance,
    loading,
    error,
    refetch,
  };
}
