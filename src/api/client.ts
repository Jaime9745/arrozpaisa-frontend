import axios, { AxiosInstance, AxiosError } from "axios";

/**
 * Shared API client configuration for all services
 */
class ApiClient {
  private api: AxiosInstance;

  constructor() {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error("NEXT_PUBLIC_API_URL environment variable is required");
    }

    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Add request interceptor for authentication
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );
  }

  /**
   * Handles errors consistently across all services
   */
  public handleError(error: any): never {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          `Error ${error.response?.status}: ${error.response?.statusText}`
      );
    }
    throw error;
  }

  /**
   * Get the Axios instance for making requests
   */
  public getInstance(): AxiosInstance {
    return this.api;
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();
