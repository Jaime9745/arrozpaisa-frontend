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
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL!;
  }

  async getAllWaiters(): Promise<Waiter[]> {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${this.baseUrl}/waiters`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al obtener los meseros");
      }

      const data: WaitersResponse = await response.json();

      return data.data || [];
    } catch (error) {
      console.error("Error in getAllWaiters:", error);
      throw error;
    }
  }

  async createWaiter(
    waiter: Omit<Waiter, "id" | "createdAt" | "updatedAt" | "password">
  ): Promise<Waiter> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/waiters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(waiter),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el mesero");
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error in createWaiter:", error);
      throw error;
    }
  }

  async updateWaiter(id: string, waiter: Partial<Waiter>): Promise<Waiter> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/waiters/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(waiter),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el mesero");
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error in updateWaiter:", error);
      throw error;
    }
  }

  async deleteWaiter(id: string): Promise<void> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/waiters/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar el mesero");
      }
    } catch (error) {
      console.error("Error in deleteWaiter:", error);
      throw error;
    }
  }
}

export const waitersService = new WaitersService();
export type { Waiter };
