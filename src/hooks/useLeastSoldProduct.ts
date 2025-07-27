import { useState, useEffect } from "react";
import { metricsService } from "@/services/metricsService";
import { LeastSoldProduct } from "@/types/metrics";

interface UseLeastSoldProductParams {
  startDate: Date;
  endDate: Date;
  enabled?: boolean;
}

interface UseLeastSoldProductReturn {
  leastSoldProduct: LeastSoldProduct | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useLeastSoldProduct({
  startDate,
  endDate,
  enabled = true,
}: UseLeastSoldProductParams): UseLeastSoldProductReturn {
  const [leastSoldProduct, setLeastSoldProduct] =
    useState<LeastSoldProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeastSoldProduct = async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const data = await metricsService.getLeastSoldProduct(startDate, endDate);

      setLeastSoldProduct(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      setLeastSoldProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchLeastSoldProduct();
    }
  }, [startDate, endDate, enabled]);

  return {
    leastSoldProduct,
    loading,
    error,
    refetch: fetchLeastSoldProduct,
  };
}
