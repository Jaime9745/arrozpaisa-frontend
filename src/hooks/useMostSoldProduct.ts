import { useState, useEffect } from "react";
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

  const fetchMostSoldProduct = async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      console.log("🔍 Fetching most sold product...", {
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      });

      const data = await metricsService.getMostSoldProduct(startDate, endDate);

      console.log("✅ Most sold product data received:", data);
      setMostSoldProduct(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      console.error("❌ Error fetching most sold product:", err);
      setError(errorMessage);
      setMostSoldProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchMostSoldProduct();
    }
  }, [startDate, endDate, enabled]);

  return {
    mostSoldProduct,
    loading,
    error,
    refetch: fetchMostSoldProduct,
  };
}
