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
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL!;
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      const token = localStorage.getItem("token");
      console.log("Fetching categories from:", `${this.baseUrl}/categories`);
      console.log("Token:", token ? "Present" : "Not present");

      const response = await fetch(`${this.baseUrl}/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        throw new Error("Error al obtener las categorías");
      }

      const data = await response.json();
      console.log("Raw response data:", data);

      // Handle different response formats
      if (Array.isArray(data)) {
        console.log("Data is array, returning directly");
        return data;
      } else if (data.categories) {
        console.log("Data has categories property");
        return data.categories;
      } else if (data.data) {
        console.log("Data has data property");
        return data.data;
      }

      console.log("No recognizable data format, returning empty array");
      return [];
    } catch (error) {
      console.error("Error in getAllCategories:", error);
      throw error;
    }
  }

  async createCategory(
    category: Omit<Category, "id" | "createdAt" | "updatedAt">
  ): Promise<Category> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear la categoría");
      }

      return await response.json();
    } catch (error) {
      console.error("Error in createCategory:", error);
      throw error;
    }
  }

  async updateCategory(
    id: string,
    category: Partial<Category>
  ): Promise<Category> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al actualizar la categoría"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error in updateCategory:", error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar la categoría");
      }
    } catch (error) {
      console.error("Error in deleteCategory:", error);
      throw error;
    }
  }
}

export const categoriesService = new CategoriesService();
