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

  async getAllProducts(): Promise<Product[]> {
    const data = await this.makeRequest<ProductsResponse | Product[]>(
      "/productes"
    );

    // Handle different response formats
    if (Array.isArray(data)) {
      return data;
    } else if ("products" in data && data.products) {
      return data.products;
    } else if ("data" in data && data.data) {
      return data.data;
    }

    return [];
  }

  async createProduct(
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ): Promise<Product> {
    // Transform the product data to match backend expectations
    const productData = {
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      price: product.price,
      imageBase64: product.imageUrl, // Backend expects imageBase64, not imageUrl
    };

    return this.makeRequest<Product>("/productes", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
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

    return this.makeRequest<Product>(`/productes/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string): Promise<void> {
    await this.makeRequest<void>(`/productes/${id}`, {
      method: "DELETE",
    });
  }
}

export const productsService = new ProductsService();
