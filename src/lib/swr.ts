import { apiClient } from "@/api/client";

/**
 * SWR fetcher function using the shared API client
 * Automatically includes authentication token from localStorage
 */
export const fetcher = async <T>(url: string): Promise<T> => {
  const response = await apiClient.getInstance().get<T>(url);
  return response.data;
};

/**
 * SWR configuration for immutable data that doesn't change
 * Use this for static configuration, categories, etc.
 */
export const immutableConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  revalidateIfStale: false,
  dedupingInterval: 60000, // 1 minute
};

/**
 * SWR configuration for frequently updated data
 * Use this for real-time data like table status
 */
export const realtimeConfig = {
  refreshInterval: 30000, // 30 seconds
  revalidateOnFocus: true,
  dedupingInterval: 5000, // 5 seconds
};

/**
 * Default SWR configuration
 */
export const defaultConfig = {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  dedupingInterval: 2000, // 2 seconds
  errorRetryCount: 3,
};
