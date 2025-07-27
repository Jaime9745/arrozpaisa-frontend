import { apiClient } from "../api";

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
  private api = apiClient.getInstance();

  // Get all tables (admin and waiters)
  async getAllTables(): Promise<Table[]> {
    try {
      const response = await this.api.get<ApiResponse<Table[]>>("/tables");
      return response.data.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  }

  // Get table by ID (admin and waiters)
  async getTableById(id: string): Promise<Table> {
    try {
      const response = await this.api.get<ApiResponse<Table>>(`/tables/${id}`);
      return response.data.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  }

  // Get table by number (admin and waiters)
  async getTableByNumber(number: number): Promise<Table> {
    try {
      const response = await this.api.get<ApiResponse<Table>>(
        `/tables/number/${number}`
      );
      return response.data.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  }

  // Get tables by status (admin and waiters)
  async getTablesByStatus(status: "libre" | "atendida"): Promise<Table[]> {
    try {
      const response = await this.api.get<ApiResponse<Table[]>>(
        `/tables/status/${status}`
      );
      return response.data.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  }

  // Get available tables (admin and waiters)
  async getAvailableTables(): Promise<Table[]> {
    try {
      const response = await this.api.get<ApiResponse<Table[]>>(
        "/tables/available/tables"
      );
      return response.data.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  }

  // Get occupied tables (admin and waiters)
  async getOccupiedTables(): Promise<Table[]> {
    try {
      const response = await this.api.get<ApiResponse<Table[]>>(
        "/tables/occupied/tables"
      );
      return response.data.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  }

  // Create table (admin only)
  async createTable(tableData: CreateTableRequest): Promise<Table> {
    try {
      const response = await this.api.post<ApiResponse<Table>>(
        "/tables",
        tableData
      );
      return response.data.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  }

  // Update table (admin only)
  async updateTable(id: string, tableData: UpdateTableRequest): Promise<Table> {
    try {
      const response = await this.api.put<ApiResponse<Table>>(
        `/tables/${id}`,
        tableData
      );
      return response.data.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  }

  // Update table status (admin and waiters)
  async updateTableStatus(
    id: string,
    status: "libre" | "atendida"
  ): Promise<Table> {
    try {
      const response = await this.api.put<ApiResponse<Table>>(
        `/tables/${id}/status`,
        { status }
      );
      return response.data.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  }

  // Delete table (admin only)
  async deleteTable(id: string): Promise<void> {
    try {
      await this.api.delete(`/tables/${id}`);
    } catch (error) {
      return apiClient.handleError(error);
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
