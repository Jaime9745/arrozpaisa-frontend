import { apiClient } from "../api";

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
  private api = apiClient.getInstance();

  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await this.api.get<ProductsResponse | Product[]>(
        "/productes"
      );

      // Handle different response formats
      if (Array.isArray(response.data)) {
        return response.data;
      } else if ("products" in response.data && response.data.products) {
        return response.data.products;
      } else if ("data" in response.data && response.data.data) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      return apiClient.handleError(error);
    }
  }

  async createProduct(
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ): Promise<Product> {
    try {
      // Transform the product data to match backend expectations
      const productData = {
        name: product.name,
        description: product.description,
        categoryId: product.categoryId,
        price: product.price,
        imageBase64: product.imageUrl, // Backend expects imageBase64, not imageUrl
      };

      const response = await this.api.post<Product>("/productes", productData);
      return response.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    try {
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

      const response = await this.api.put<Product>(
        `/productes/${id}`,
        productData
      );
      return response.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await this.api.delete(`/productes/${id}`);
    } catch (error) {
      return apiClient.handleError(error);
    }
  }
}

export const productsService = new ProductsService();
