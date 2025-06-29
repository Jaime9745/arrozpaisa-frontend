const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Types based on your backend DTOs
export interface TableMetrics {
  totalTables: number;
  occupiedTables: number;
  freeTables: number;
  tables: Array<{
    id: string;
    number: number;
    status: "attended" | "free";
    currentOrder?: string;
  }>;
  fromCache: boolean;
  cacheKey: string;
  cacheTTL: number;
  calculatedAt: string;
}

export interface RealTimeMetrics {
  todaySales: number;
  todayOrders: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
    totalSales: number;
  }>;
  occupiedTables: number;
  activeWaiters: number;
  fromCache: boolean;
  cacheKey: string;
  cacheTTL: number;
  calculatedAt: string;
}

export interface WaiterPerformance {
  waiterId: string;
  waiterName: string;
  totalOrders: number;
  totalSales: number;
  averageOrderValue: number;
  ordersByDay: Array<{
    date: string;
    orders: number;
    sales: number;
  }>;
  fromCache: boolean;
  cacheKey: string;
  cacheTTL: number;
  calculatedAt: string;
}

export interface PeakHoursMetrics {
  date: string;
  hourlyActivity: Array<{
    hour: number;
    orders: number;
    sales: number;
  }>;
  peakHours: Array<{
    hour: number;
    activity: "low" | "medium" | "high";
  }>;
  fromCache: boolean;
  cacheKey: string;
  cacheTTL: number;
  calculatedAt: string;
}

export interface FinancialMetrics {
  period: "day" | "week" | "month";
  startDate: string;
  endDate: string;
  totalRevenue: number;
  totalTips: number;
  averageTipPercentage: number;
  revenueByDay: Array<{
    date: string;
    revenue: number;
    tips: number;
  }>;
  fromCache: boolean;
  cacheKey: string;
  cacheTTL: number;
  calculatedAt: string;
}

export interface SalesMetrics {
  period: "day" | "week" | "month";
  startDate: string;
  endDate: string;
  totalSales: number;
  totalOrders: number;
  totalTips: number;
  averageOrderValue: number;
  salesByDay: Array<{
    date: string;
    sales: number;
    orders: number;
  }>;
  fromCache: boolean;
  cacheKey: string;
  cacheTTL: number;
  calculatedAt: string;
}

// Waiter interface for getting all waiters
export interface Waiter {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
}

// API Service Class
export class MetricsService {
  private async makeRequest<T>(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<T> {
    const url = new URL(`${API_BASE_URL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const token = localStorage.getItem("token");

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
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

  // Get waiter performance
  async getWaiterPerformance(
    waiterId: string,
    startDate: Date,
    endDate: Date
  ): Promise<WaiterPerformance> {
    return this.makeRequest<WaiterPerformance>("/metrics/waiters", {
      waiterId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  }

  // Get all waiters - assuming you have this endpoint
  async getAllWaiters(): Promise<Waiter[]> {
    return this.makeRequest<Waiter[]>("/waiters");
  }

  // Get all waiters performance for today
  async getAllWaitersPerformance(
    startDate: Date,
    endDate: Date
  ): Promise<WaiterPerformance[]> {
    try {
      // First get all waiters
      const waiters = await this.getAllWaiters();

      // Then get performance for each waiter
      const performancePromises = waiters.map((waiter) =>
        this.getWaiterPerformance(waiter.id, startDate, endDate).catch(
          (error) => {
            console.warn(
              `Error getting performance for waiter ${waiter.id}:`,
              error
            );
            // Return a default performance object if individual waiter fails
            return {
              waiterId: waiter.id,
              waiterName: `${waiter.firstName} ${waiter.lastName}`,
              totalOrders: 0,
              totalSales: 0,
              averageOrderValue: 0,
              ordersByDay: [],
              fromCache: false,
              cacheKey: "",
              cacheTTL: 0,
              calculatedAt: new Date().toISOString(),
            };
          }
        )
      );

      return Promise.all(performancePromises);
    } catch (error) {
      console.error("Error getting all waiters performance:", error);
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
}

// Export singleton instance
export const metricsService = new MetricsService();
