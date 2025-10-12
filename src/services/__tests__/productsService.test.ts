import MockAdapter from "axios-mock-adapter";
import { apiClient } from "../../api/client";
import { productsService, Product } from "../productsService";

describe("ProductsService - Integration Tests", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(apiClient.getInstance());
    localStorage.clear();
  });

  afterEach(() => {
    mock.restore();
  });

  describe("getAllProducts", () => {
    it("should fetch all products successfully (array response)", async () => {
      const mockProducts: Product[] = [
        {
          id: "1",
          name: "Arroz Paisa",
          description: "Delicioso arroz paisa",
          imageUrl: "https://example.com/image1.jpg",
          categoryId: "cat-1",
          price: 15000,
          isActive: true,
        },
        {
          id: "2",
          name: "Bandeja Paisa",
          description: "La mejor bandeja paisa",
          imageUrl: "https://example.com/image2.jpg",
          categoryId: "cat-2",
          price: 25000,
          isActive: true,
        },
      ];

      mock.onGet("/productes").reply(200, mockProducts);

      const result = await productsService.getAllProducts();

      expect(result).toEqual(mockProducts);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Arroz Paisa");
    });

    it("should fetch all products successfully (object with products property)", async () => {
      const mockProducts: Product[] = [
        {
          id: "1",
          name: "Arroz Paisa",
          description: "Delicioso arroz paisa",
          imageUrl: "https://example.com/image1.jpg",
          categoryId: "cat-1",
          price: 15000,
          isActive: true,
        },
      ];

      mock.onGet("/productes").reply(200, { products: mockProducts });

      const result = await productsService.getAllProducts();

      expect(result).toEqual(mockProducts);
      expect(result).toHaveLength(1);
    });

    it("should return empty array when no products exist", async () => {
      mock.onGet("/productes").reply(200, []);

      const result = await productsService.getAllProducts();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should handle network errors", async () => {
      mock.onGet("/productes").networkError();

      await expect(productsService.getAllProducts()).rejects.toThrow();
    });

    it("should handle 404 errors", async () => {
      mock.onGet("/productes").reply(404, {
        message: "Products not found",
      });

      await expect(productsService.getAllProducts()).rejects.toThrow(
        "Products not found"
      );
    });
  });

  describe("createProduct", () => {
    it("should create a new product successfully", async () => {
      const newProduct = {
        name: "Nuevo Plato",
        description: "Descripción del nuevo plato",
        imageUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
        categoryId: "cat-1",
        price: 18000,
        isActive: true,
      };

      const mockResponse: Product = {
        id: "123",
        ...newProduct,
      };

      mock.onPost("/productes").reply(200, mockResponse);

      const result = await productsService.createProduct(newProduct);

      expect(result).toEqual(mockResponse);
      expect(result.id).toBe("123");
      expect(result.name).toBe("Nuevo Plato");
    });

    it("should handle validation errors when creating product", async () => {
      const invalidProduct = {
        name: "",
        description: "Test",
        imageUrl: "test.jpg",
        categoryId: "cat-1",
        price: -100,
        isActive: true,
      };

      mock.onPost("/productes").reply(400, {
        message:
          "Validation error: Name is required and price must be positive",
      });

      await expect(
        productsService.createProduct(invalidProduct)
      ).rejects.toThrow("Validation error");
    });

    it("should handle unauthorized errors", async () => {
      const newProduct = {
        name: "Nuevo Plato",
        description: "Test",
        imageUrl: "test.jpg",
        categoryId: "cat-1",
        price: 18000,
        isActive: true,
      };

      mock.onPost("/productes").reply(401, {
        message: "Unauthorized",
      });

      await expect(productsService.createProduct(newProduct)).rejects.toThrow(
        "Unauthorized"
      );
    });
  });

  describe("updateProduct", () => {
    it("should update a product successfully", async () => {
      const productId = "123";
      const updates = {
        name: "Nombre Actualizado",
        price: 20000,
      };

      const mockResponse: Product = {
        id: productId,
        name: "Nombre Actualizado",
        description: "Descripción original",
        imageUrl: "https://example.com/image.jpg",
        categoryId: "cat-1",
        price: 20000,
        isActive: true,
      };

      mock.onPut(`/productes/${productId}`).reply(200, mockResponse);

      const result = await productsService.updateProduct(productId, updates);

      expect(result).toEqual(mockResponse);
      expect(result.name).toBe("Nombre Actualizado");
      expect(result.price).toBe(20000);
    });

    it("should handle product not found error", async () => {
      const productId = "non-existent-id";
      const updates = { name: "Test" };

      mock.onPut(`/productes/${productId}`).reply(404, {
        message: "Product not found",
      });

      await expect(
        productsService.updateProduct(productId, updates)
      ).rejects.toThrow("Product not found");
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product successfully", async () => {
      const productId = "123";

      mock.onDelete(`/productes/${productId}`).reply(204);

      await expect(
        productsService.deleteProduct(productId)
      ).resolves.not.toThrow();
    });

    it("should handle delete errors", async () => {
      const productId = "123";

      mock.onDelete(`/productes/${productId}`).reply(404, {
        message: "Product not found",
      });

      await expect(productsService.deleteProduct(productId)).rejects.toThrow(
        "Product not found"
      );
    });
  });
});
