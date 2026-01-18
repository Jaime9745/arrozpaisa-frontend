import { useState, useEffect, useCallback } from "react";
import { metricsService } from "@/services/metricsService";
import { MostSoldProduct } from "@/types/metrics";

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

export function useMostSoldProduct({
  startDate,
  endDate,
  enabled = true,
}: UseMostSoldProductParams): UseMostSoldProductReturn {
  const [mostSoldProduct, setMostSoldProduct] =
    useState<MostSoldProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Use timestamps for stable dependencies
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();

  const fetchMostSoldProduct = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const data = await metricsService.getMostSoldProduct(
        new Date(startTime),
        new Date(endTime),
      );

      setMostSoldProduct(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      setMostSoldProduct(null);
    } finally {
      setLoading(false);
    }
  }, [startTime, endTime, enabled]);

  useEffect(() => {
    if (enabled) {
      fetchMostSoldProduct();
    }
  }, [fetchMostSoldProduct, enabled]);

  return {
    mostSoldProduct,
    loading,
    error,
    refetch: fetchMostSoldProduct,
  };
}
