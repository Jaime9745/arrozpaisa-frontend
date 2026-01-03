import { apiClient } from "../api";
import {
  TableMetrics,
  RealTimeMetrics,
  WaiterPerformance,
  PeakHoursMetrics,
  FinancialMetrics,
  SalesMetrics,
  ProductMetrics,
  AllWaitersPerformanceDTO,
  MostSoldProduct,
  LeastSoldProduct,
  HourlyFlowMetrics,
} from "@/types/metrics";

// API Service Class
export class MetricsService {
  private api = apiClient.getInstance();

  private async makeRequest<T>(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<T> {
    try {
      const response = await this.api.get<T>(endpoint, {
        params,
      });
      return response.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  }

  // Get table metrics
  async getTableMetrics(): Promise<TableMetrics> {
    return this.makeRequest<TableMetrics>("/metrics/tables");
  }

  // Get real-time metrics
  async getRealTimeMetrics(): Promise<RealTimeMetrics> {
    return this.makeRequest<RealTimeMetrics>("/metrics/realtime");
  }

  // Get sales metrics
  async getSalesMetrics(
    period: "day" | "week" | "month",
    startDate: Date,
    endDate: Date
  ): Promise<SalesMetrics> {
    return this.makeRequest<SalesMetrics>("/metrics/sales", {
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  }

  // Get product metrics
  async getProductMetrics(
    period: "week" | "month",
    startDate: Date,
    endDate: Date
  ): Promise<ProductMetrics> {
    return this.makeRequest<ProductMetrics>("/metrics/products", {
      period,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    });
  }

  // Get waiter performance for a specific waiter
  async getWaiterPerformance(
    waiterId: string,
    startDate: Date,
    endDate: Date
  ): Promise<WaiterPerformance> {
    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    try {
      const result = await this.makeRequest<WaiterPerformance>(
        "/metrics/waiters",
        {
          waiterId,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        }
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get performance for all waiters (optimized - single API call)
  async getAllWaitersPerformance(
    startDate: Date,
    endDate: Date
  ): Promise<WaiterPerformance[]> {
    try {
      // ✅ Single API call to get all waiters performance
      const result = await this.makeRequest<AllWaitersPerformanceDTO>(
        "/metrics/all-waiters",
        {
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        }
      );

      // Transform the response to match WaiterPerformance[] interface
      const waiterPerformances: WaiterPerformance[] = result.waiters.map(
        (waiter) => ({
          waiterId: waiter.waiterId,
          waiterName: waiter.waiterName,
          totalOrders: waiter.totalOrders,
          totalSales: waiter.totalSales,
          averageOrderValue: waiter.averageOrderValue,
          ordersByDay: waiter.ordersByDay || [],
          fromCache: result.fromCache,
          cacheKey: result.cacheKey,
          cacheTTL: result.cacheTTL,
          calculatedAt: result.calculatedAt,
        })
      );

      return waiterPerformances;
    } catch (error) {
      throw error;
    }
  }

  // Get peak hours metrics
  async getPeakHoursMetrics(date: Date): Promise<PeakHoursMetrics> {
    return this.makeRequest<PeakHoursMetrics>("/metrics/peak-hours", {
      date: date.toISOString().split("T")[0],
    });
  }

  // Get financial metrics
  async getFinancialMetrics(
    period: "day" | "week" | "month",
    startDate: Date,
    endDate: Date
  ): Promise<FinancialMetrics> {
    return this.makeRequest<FinancialMetrics>("/metrics/financial", {
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  }

  // Invalidate cache
  async invalidateCache(): Promise<void> {
    await this.makeRequest<void>("/metrics/invalidate");
  }

  // Get most sold product
  async getMostSoldProduct(
    startDate: Date,
    endDate: Date
  ): Promise<MostSoldProduct> {
    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    try {
      const result = await this.makeRequest<MostSoldProduct>(
        "/metrics/most-sold-product",
        {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        }
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get least sold product
  async getLeastSoldProduct(
    startDate: Date,
    endDate: Date
  ): Promise<LeastSoldProduct> {
    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    try {
      const result = await this.makeRequest<LeastSoldProduct>(
        "/metrics/least-sold-product",
        {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        }
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get hourly flow metrics (7am - 7pm)
  async getHourlyFlowMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<HourlyFlowMetrics> {
    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    try {
      const result = await this.makeRequest<HourlyFlowMetrics>(
        "/metrics/hourly-flow",
        {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        }
      );

      return result;
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
export const metricsService = new MetricsService();
