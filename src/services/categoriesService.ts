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

  async getAllCategories(): Promise<Category[]> {
    const data = await this.makeRequest<CategoriesResponse | Category[]>(
      "/categories"
    );

    // Handle different response formats
    if (Array.isArray(data)) {
      return data;
    } else if ("categories" in data && data.categories) {
      return data.categories;
    } else if ("data" in data && data.data) {
      return data.data;
    }

    return [];
  }

  async createCategory(
    category: Omit<Category, "id" | "createdAt" | "updatedAt">
  ): Promise<Category> {
    return this.makeRequest<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(category),
    });
  }

  async updateCategory(
    id: string,
    category: Partial<Category>
  ): Promise<Category> {
    return this.makeRequest<Category>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(category),
    });
  }

  async deleteCategory(id: string): Promise<void> {
    await this.makeRequest<void>(`/categories/${id}`, {
      method: "DELETE",
    });
  }
}

export const categoriesService = new CategoriesService();
