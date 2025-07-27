import { apiClient } from "../api";

interface Waiter {
  id: string;
  firstName: string;
  lastName: string;
  identificationNumber: string;
  phoneNumber: string;
  userName: string;
  password?: string; // Optional since we might not always need it
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface WaitersResponse {
  data: Waiter[];
}

class WaitersService {
  private api = apiClient.getInstance();

  async getAllWaiters(): Promise<Waiter[]> {
    try {
      const response = await this.api.get<WaitersResponse>("/waiters");
      return response.data.data || [];
    } catch (error) {
      return apiClient.handleError(error);
    }
  }

  async createWaiter(
    waiter: Omit<Waiter, "id" | "createdAt" | "updatedAt" | "password">
  ): Promise<Waiter> {
    try {
      const response = await this.api.post<{ data: Waiter }>(
        "/waiters",
        waiter
      );
      return response.data.data || response.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  }

  async updateWaiter(id: string, waiter: Partial<Waiter>): Promise<Waiter> {
    try {
      const response = await this.api.put<{ data: Waiter }>(
        `/waiters/${id}`,
        waiter
      );
      return response.data.data || response.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  }

  async deleteWaiter(id: string): Promise<void> {
    try {
      await this.api.delete(`/waiters/${id}`);
    } catch (error) {
      return apiClient.handleError(error);
    }
  }
}

export const waitersService = new WaitersService();
export type { Waiter };
