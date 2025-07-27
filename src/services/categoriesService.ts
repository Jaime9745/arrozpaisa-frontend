import { apiClient } from "../api";

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CategoriesResponse {
  categories?: Category[];
  data?: Category[];
}

class CategoriesService {
  private api = apiClient.getInstance();

  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await this.api.get<CategoriesResponse | Category[]>(
        "/categories"
      );

      // Handle different response formats
      if (Array.isArray(response.data)) {
        return response.data;
      } else if ("categories" in response.data && response.data.categories) {
        return response.data.categories;
      } else if ("data" in response.data && response.data.data) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      return apiClient.handleError(error);
    }
  }

  async createCategory(
    category: Omit<Category, "id" | "createdAt" | "updatedAt">
  ): Promise<Category> {
    try {
      const response = await this.api.post<Category>("/categories", category);
      return response.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  }

  async updateCategory(
    id: string,
    category: Partial<Category>
  ): Promise<Category> {
    try {
      const response = await this.api.put<Category>(
        `/categories/${id}`,
        category
      );
      return response.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await this.api.delete(`/categories/${id}`);
    } catch (error) {
      return apiClient.handleError(error);
    }
  }
}

export const categoriesService = new CategoriesService();
