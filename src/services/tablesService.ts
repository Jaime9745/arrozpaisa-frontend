export interface Table {
  id: string;
  number: number;
  status: "libre" | "atendida";
  capacity?: number;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTableRequest {
  number: number;
  capacity?: number;
  location?: string;
}

export interface UpdateTableRequest {
  number?: number;
  capacity?: number;
  location?: string;
  status?: "libre" | "atendida";
}

export interface UpdateTableStatusRequest {
  status: "libre" | "atendida";
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

class TablesService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL!;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }
    return response.json();
  }

  // Get all tables (admin and waiters)
  async getAllTables(): Promise<Table[]> {
    try {
      const response = await fetch(`${this.baseUrl}/tables`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse<ApiResponse<Table[]>>(response);
      return result.data;
    } catch (error) {
      console.error("Error fetching tables:", error);
      throw error;
    }
  }

  // Get table by ID (admin and waiters)
  async getTableById(id: string): Promise<Table> {
    try {
      const response = await fetch(`${this.baseUrl}/tables/${id}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse<ApiResponse<Table>>(response);
      return result.data;
    } catch (error) {
      console.error(`Error fetching table ${id}:`, error);
      throw error;
    }
  }

  // Get table by number (admin and waiters)
  async getTableByNumber(number: number): Promise<Table> {
    try {
      const response = await fetch(`${this.baseUrl}/tables/number/${number}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse<ApiResponse<Table>>(response);
      return result.data;
    } catch (error) {
      console.error(`Error fetching table number ${number}:`, error);
      throw error;
    }
  }

  // Get tables by status (admin and waiters)
  async getTablesByStatus(status: "libre" | "atendida"): Promise<Table[]> {
    try {
      const response = await fetch(`${this.baseUrl}/tables/status/${status}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse<ApiResponse<Table[]>>(response);
      return result.data;
    } catch (error) {
      console.error(`Error fetching tables with status ${status}:`, error);
      throw error;
    }
  }

  // Get available tables (admin and waiters)
  async getAvailableTables(): Promise<Table[]> {
    try {
      const response = await fetch(`${this.baseUrl}/tables/available/tables`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse<ApiResponse<Table[]>>(response);
      return result.data;
    } catch (error) {
      console.error("Error fetching available tables:", error);
      throw error;
    }
  }

  // Get occupied tables (admin and waiters)
  async getOccupiedTables(): Promise<Table[]> {
    try {
      const response = await fetch(`${this.baseUrl}/tables/occupied/tables`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse<ApiResponse<Table[]>>(response);
      return result.data;
    } catch (error) {
      console.error("Error fetching occupied tables:", error);
      throw error;
    }
  }

  // Update table (admin only)
  async updateTable(id: string, tableData: UpdateTableRequest): Promise<Table> {
    try {
      const response = await fetch(`${this.baseUrl}/tables/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(tableData),
      });

      const result = await this.handleResponse<ApiResponse<Table>>(response);
      return result.data;
    } catch (error) {
      console.error(`Error updating table ${id}:`, error);
      throw error;
    }
  }

  // Update table status (admin and waiters)
  async updateTableStatus(
    id: string,
    status: "libre" | "atendida"
  ): Promise<Table> {
    try {
      const response = await fetch(`${this.baseUrl}/tables/${id}/status`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status }),
      });

      const result = await this.handleResponse<ApiResponse<Table>>(response);
      return result.data;
    } catch (error) {
      console.error(`Error updating table ${id} status:`, error);
      throw error;
    }
  }

  // Delete table (admin only)
  async deleteTable(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/tables/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });

      await this.handleResponse<{ message: string }>(response);
    } catch (error) {
      console.error(`Error deleting table ${id}:`, error);
      throw error;
    }
  }

  // Helper method to get free tables (alias for available tables)
  async getFreeTables(): Promise<Table[]> {
    return this.getAvailableTables();
  }

  // Helper method to get served tables (alias for occupied tables)
  async getServedTables(): Promise<Table[]> {
    return this.getOccupiedTables();
  }

  // Helper method to mark table as free
  async markTableAsFree(id: string): Promise<Table> {
    return this.updateTableStatus(id, "libre");
  }

  // Helper method to mark table as served
  async markTableAsServed(id: string): Promise<Table> {
    return this.updateTableStatus(id, "atendida");
  }
}

export const tablesService = new TablesService();
