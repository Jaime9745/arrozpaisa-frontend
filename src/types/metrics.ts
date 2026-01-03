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

export interface ProductMetrics {
  period: "week" | "month";
  startDate: string;
  endDate: string;
  topProducts: Array<{
    productId: string;
    productName: string;
    category: string;
    quantity: number;
    totalSales: number;
    percentageOfTotal: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    totalSales: number;
    totalQuantity: number;
    percentageOfTotal: number;
  }>;
  fromCache: boolean;
  cacheKey: string;
  cacheTTL: number;
  calculatedAt: string;
}

// All Waiters Performance DTO for optimized endpoint
export interface AllWaitersPerformanceDTO {
  startDate: string;
  endDate: string;
  totalWaiters: number;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  waiters: Array<{
    waiterId: string;
    waiterName: string;
    totalOrders: number;
    totalSales: number;
    averageOrderValue: number;
    percentageOfTotalSales: number;
    ordersByDay?: Array<{
      date: string;
      orders: number;
      sales: number;
    }>;
  }>;
  fromCache: boolean;
  cacheKey: string;
  cacheTTL: number;
  calculatedAt: string;
}

// New interfaces for most and least sold products
export interface MostSoldProduct {
  mostSoldProduct: {
    name: string;
    imageUrl: string;
    totalSold: number;
  };
  calculatedAt: string;
}

export interface LeastSoldProduct {
  leastSoldProduct: {
    name: string;
    imageUrl: string;
    totalSold: number;
  };
  calculatedAt: string;
}

// Flujo de atención por franja horaria (7am - 7pm)
export interface HourlyFlowMetrics {
  date: string;
  startHour: number;
  endHour: number;
  hourlyFlow: Array<{
    hour: number;
    hourLabel: string;
    ordersCount: number;
    customersServed: number;
  }>;
  totalOrdersInRange: number;
  peakHour: number;
  peakHourLabel: string;
  fromCache: boolean;
  cacheKey: string;
  cacheTTL: number;
  calculatedAt: string;
}
