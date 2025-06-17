interface ProductVariant {
  name: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  isActive: boolean;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

interface ProductsResponse {
  products?: Product[];
  // In case your backend returns products directly as an array
  data?: Product[];
}

class ProductsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const token = localStorage.getItem("token");
      console.log("Fetching products from:", `${this.baseUrl}/productes`);
      console.log("Token:", token ? "Present" : "Not present");

      const response = await fetch(`${this.baseUrl}/productes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        throw new Error("Error al obtener los productos");
      }

      const data = await response.json();
      console.log("Raw response data:", data);

      // Handle different response formats
      if (Array.isArray(data)) {
        console.log("Data is array, returning directly");
        return data;
      } else if (data.products) {
        console.log("Data has products property");
        return data.products;
      } else if (data.data) {
        console.log("Data has data property");
        return data.data;
      }

      console.log("No recognizable data format, returning empty array");
      return [];
    } catch (error) {
      console.error("Error in getAllProducts:", error);
      throw error;
    }
  }

  async createProduct(
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ): Promise<Product> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/productes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el producto");
      }

      return await response.json();
    } catch (error) {
      console.error("Error in createProduct:", error);
      throw error;
    }
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/productes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el producto");
      }

      return await response.json();
    } catch (error) {
      console.error("Error in updateProduct:", error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/productes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar el producto");
      }
    } catch (error) {
      console.error("Error in deleteProduct:", error);
      throw error;
    }
  }
}

export const productsService = new ProductsService();
export type { Product, ProductVariant };
