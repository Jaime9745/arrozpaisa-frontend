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
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }

    return response.json();
  }

  // Get all tables (admin and waiters)
  async getAllTables(): Promise<Table[]> {
    const result = await this.makeRequest<ApiResponse<Table[]>>("/tables");
    return result.data;
  }

  // Get table by ID (admin and waiters)
  async getTableById(id: string): Promise<Table> {
    const result = await this.makeRequest<ApiResponse<Table>>(`/tables/${id}`);
    return result.data;
  }

  // Get table by number (admin and waiters)
  async getTableByNumber(number: number): Promise<Table> {
    const result = await this.makeRequest<ApiResponse<Table>>(
      `/tables/number/${number}`
    );
    return result.data;
  }

  // Get tables by status (admin and waiters)
  async getTablesByStatus(status: "libre" | "atendida"): Promise<Table[]> {
    const result = await this.makeRequest<ApiResponse<Table[]>>(
      `/tables/status/${status}`
    );
    return result.data;
  }

  // Get available tables (admin and waiters)
  async getAvailableTables(): Promise<Table[]> {
    const result = await this.makeRequest<ApiResponse<Table[]>>(
      "/tables/available/tables"
    );
    return result.data;
  }

  // Get occupied tables (admin and waiters)
  async getOccupiedTables(): Promise<Table[]> {
    const result = await this.makeRequest<ApiResponse<Table[]>>(
      "/tables/occupied/tables"
    );
    return result.data;
  }

  // Create table (admin only)
  async createTable(tableData: CreateTableRequest): Promise<Table> {
    const result = await this.makeRequest<ApiResponse<Table>>("/tables", {
      method: "POST",
      body: JSON.stringify(tableData),
    });
    return result.data;
  }

  // Update table (admin only)
  async updateTable(id: string, tableData: UpdateTableRequest): Promise<Table> {
    const result = await this.makeRequest<ApiResponse<Table>>(`/tables/${id}`, {
      method: "PUT",
      body: JSON.stringify(tableData),
    });
    return result.data;
  }

  // Update table status (admin and waiters)
  async updateTableStatus(
    id: string,
    status: "libre" | "atendida"
  ): Promise<Table> {
    const result = await this.makeRequest<ApiResponse<Table>>(
      `/tables/${id}/status`,
      {
        method: "PUT",
        body: JSON.stringify({ status }),
      }
    );
    return result.data;
  }

  // Delete table (admin only)
  async deleteTable(id: string): Promise<void> {
    await this.makeRequest<{ message: string }>(`/tables/${id}`, {
      method: "DELETE",
    });
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
