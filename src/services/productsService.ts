export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  price: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductsResponse {
  products?: Product[];
  // In case your backend returns products directly as an array
  data?: Product[];
}

class ProductsService {
  private baseUrl: string;
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL!;
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${this.baseUrl}/productes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los productos");
      }

      const data = await response.json();

      // Handle different response formats
      if (Array.isArray(data)) {
        return data;
      } else if (data.products) {
        return data.products;
      } else if (data.data) {
        return data.data;
      }

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

      // Transform the product data to match backend expectations
      const productData = {
        name: product.name,
        description: product.description,
        categoryId: product.categoryId,
        price: product.price,
        imageBase64: product.imageUrl, // Backend expects imageBase64, not imageUrl
      };

      const response = await fetch(`${this.baseUrl}/productes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(productData),
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

      // Transform the product data to match backend expectations
      const productData: any = {};

      if (product.name !== undefined) productData.name = product.name;
      if (product.description !== undefined)
        productData.description = product.description;
      if (product.categoryId !== undefined)
        productData.categoryId = product.categoryId;
      if (product.price !== undefined) productData.price = product.price;
      if (product.imageUrl !== undefined) {
        // Backend expects imageBase64, not imageUrl
        productData.imageBase64 = product.imageUrl;
      }

      const response = await fetch(`${this.baseUrl}/productes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(productData),
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
