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
  private baseUrl: string;

  constructor() {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error("NEXT_PUBLIC_API_URL environment variable is required");
    }
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem("token");

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  async getAllWaiters(): Promise<Waiter[]> {
    const data = await this.makeRequest<WaitersResponse>("/waiters");
    return data.data || [];
  }

  async createWaiter(
    waiter: Omit<Waiter, "id" | "createdAt" | "updatedAt" | "password">
  ): Promise<Waiter> {
    const result = await this.makeRequest<{ data: Waiter }>("/waiters", {
      method: "POST",
      body: JSON.stringify(waiter),
    });
    return result.data || result;
  }

  async updateWaiter(id: string, waiter: Partial<Waiter>): Promise<Waiter> {
    const result = await this.makeRequest<{ data: Waiter }>(`/waiters/${id}`, {
      method: "PUT",
      body: JSON.stringify(waiter),
    });
    return result.data || result;
  }

  async deleteWaiter(id: string): Promise<void> {
    await this.makeRequest<void>(`/waiters/${id}`, {
      method: "DELETE",
    });
  }
}

export const waitersService = new WaitersService();
export type { Waiter };
