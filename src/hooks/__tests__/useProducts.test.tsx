import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import MockAdapter from "axios-mock-adapter";
import { apiClient } from "../../api/client";
import { useProducts } from "../useProducts";
import { Product } from "@/services/productsService";
import { SWRConfig } from "swr";
import React from "react";

// Wrapper with fresh cache for each test
const createWrapper = () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      {children}
    </SWRConfig>
  );
  return Wrapper;
};

describe("useProducts Hook", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(apiClient.getInstance());
    localStorage.clear();
  });

  afterEach(() => {
    mock.restore();
  });

  describe("fetchProducts", () => {
    it("should fetch products successfully on mount", async () => {
      const mockProducts: Product[] = [
        {
          id: "1",
          name: "Arroz Paisa",
          description: "Delicioso",
          imageUrl: "test.jpg",
          categoryId: "cat-1",
          price: 15000,
          isActive: true,
        },
        {
          id: "2",
          name: "Bandeja Paisa",
          description: "Rica",
          imageUrl: "test2.jpg",
          categoryId: "cat-2",
          price: 25000,
          isActive: true,
        },
      ];

      mock.onGet("/productes").reply(200, mockProducts);

      const { result } = renderHook(() => useProducts(), { wrapper: createWrapper() });

      // SWR starts with empty data
      expect(result.current.products).toEqual([]);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.products).toEqual(mockProducts);
      expect(result.current.products).toHaveLength(2);
      expect(result.current.error).toBeNull();
    });

    it("should handle fetch error", async () => {
      mock.onGet("/productes").reply(500, { message: "Server error" });

      const { result } = renderHook(() => useProducts(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // SWR stores error message from error.message
      expect(result.current.error).not.toBeNull();
      expect(result.current.products).toEqual([]);
    });

    it("should refetch products when calling fetchProducts", async () => {
      const initialProducts: Product[] = [
        {
          id: "1",
          name: "Product 1",
          description: "Desc",
          imageUrl: "test.jpg",
          categoryId: "cat-1",
          price: 10000,
          isActive: true,
        },
      ];

      const updatedProducts: Product[] = [
        {
          id: "1",
          name: "Product 1",
          description: "Desc",
          imageUrl: "test.jpg",
          categoryId: "cat-1",
          price: 10000,
          isActive: true,
        },
        {
          id: "2",
          name: "Product 2",
          description: "Desc 2",
          imageUrl: "test2.jpg",
          categoryId: "cat-2",
          price: 20000,
          isActive: true,
        },
      ];

      mock.onGet("/productes").replyOnce(200, initialProducts);

      const { result } = renderHook(() => useProducts(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.products).toHaveLength(1);
      });

      mock.onGet("/productes").replyOnce(200, updatedProducts);

      await act(async () => {
        result.current.fetchProducts();
      });

      await waitFor(() => {
        expect(result.current.products).toHaveLength(2);
      });
    });
  });

  describe("createProduct", () => {
    it("should create a new product successfully", async () => {
      mock.onGet("/productes").reply(200, []);

      const { result } = renderHook(() => useProducts(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newProduct = {
        name: "Nuevo Producto",
        description: "Nueva descripción",
        imageUrl: "new.jpg",
        categoryId: "cat-1",
        price: 30000,
        isActive: true,
      };

      const createdProduct: Product = {
        id: "123",
        ...newProduct,
      };

      mock.onPost("/productes").reply(200, createdProduct);

      let createdResult: Product | undefined;

      await act(async () => {
        createdResult = await result.current.createProduct(newProduct);
      });

      expect(createdResult).toEqual(createdProduct);
      // SWR optimistically updates the cache
      expect(result.current.products).toContainEqual(createdProduct);
      expect(result.current.error).toBeNull();
    });

    it("should handle create product error", async () => {
      mock.onGet("/productes").reply(200, []);

      const { result } = renderHook(() => useProducts(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newProduct = {
        name: "",
        description: "Test",
        imageUrl: "test.jpg",
        categoryId: "cat-1",
        price: 10000,
        isActive: true,
      };

      mock.onPost("/productes").reply(400, { message: "Validation error" });

      await expect(
        act(async () => {
          await result.current.createProduct(newProduct);
        })
      ).rejects.toThrow();

      expect(result.current.products).toHaveLength(0);
    });
  });

  describe("updateProduct", () => {
    it("should update a product successfully", async () => {
      const initialProducts: Product[] = [
        {
          id: "1",
          name: "Original Name",
          description: "Original",
          imageUrl: "original.jpg",
          categoryId: "cat-1",
          price: 10000,
          isActive: true,
        },
      ];

      mock.onGet("/productes").reply(200, initialProducts);

      const { result } = renderHook(() => useProducts(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.products).toHaveLength(1);
      });

      const updates = {
        name: "Updated Name",
        price: 15000,
      };

      const updatedProduct: Product = {
        id: "1",
        name: "Updated Name",
        description: "Original",
        imageUrl: "original.jpg",
        categoryId: "cat-1",
        price: 15000,
        isActive: true,
      };

      mock.onPut("/productes/1").reply(200, updatedProduct);

      await act(async () => {
        await result.current.updateProduct("1", updates);
      });

      expect(result.current.products[0].name).toBe("Updated Name");
      expect(result.current.products[0].price).toBe(15000);
      expect(result.current.error).toBeNull();
    });

    it("should handle image update correctly", async () => {
      const initialProducts: Product[] = [
        {
          id: "1",
          name: "Product",
          description: "Desc",
          imageUrl: "old.jpg",
          categoryId: "cat-1",
          price: 10000,
          isActive: true,
        },
      ];

      mock.onGet("/productes").reply(200, initialProducts);

      const { result } = renderHook(() => useProducts(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.products).toHaveLength(1);
      });

      const updates = {
        imageUrl: "data:image/jpeg;base64,newimage",
      };

      const updatedProduct: Product = {
        ...initialProducts[0],
        imageUrl: "old.jpg", // Backend might return old URL
      };

      mock.onPut("/productes/1").reply(200, updatedProduct);

      await act(async () => {
        await result.current.updateProduct("1", updates);
      });

      // Should use the new base64 image
      expect(result.current.products[0].imageUrl).toBe(
        "data:image/jpeg;base64,newimage"
      );
    });

    it("should handle update product error", async () => {
      const initialProducts: Product[] = [
        {
          id: "1",
          name: "Product",
          description: "Desc",
          imageUrl: "test.jpg",
          categoryId: "cat-1",
          price: 10000,
          isActive: true,
        },
      ];

      mock.onGet("/productes").reply(200, initialProducts);

      const { result } = renderHook(() => useProducts(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.products).toHaveLength(1);
      });

      mock.onPut("/productes/1").reply(404, { message: "Product not found" });

      await expect(
        act(async () => {
          await result.current.updateProduct("1", { name: "New Name" });
        })
      ).rejects.toThrow();
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product successfully", async () => {
      const initialProducts: Product[] = [
        {
          id: "1",
          name: "Product 1",
          description: "Desc 1",
          imageUrl: "test1.jpg",
          categoryId: "cat-1",
          price: 10000,
          isActive: true,
        },
        {
          id: "2",
          name: "Product 2",
          description: "Desc 2",
          imageUrl: "test2.jpg",
          categoryId: "cat-2",
          price: 20000,
          isActive: true,
        },
      ];

      mock.onGet("/productes").reply(200, initialProducts);

      const { result } = renderHook(() => useProducts(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.products).toHaveLength(2);
      });

      mock.onDelete("/productes/1").reply(204);

      await act(async () => {
        await result.current.deleteProduct("1");
      });

      expect(result.current.products).toHaveLength(1);
      expect(result.current.products[0].id).toBe("2");
      expect(result.current.error).toBeNull();
    });

    it("should handle delete product error", async () => {
      const initialProducts: Product[] = [
        {
          id: "1",
          name: "Product",
          description: "Desc",
          imageUrl: "test.jpg",
          categoryId: "cat-1",
          price: 10000,
          isActive: true,
        },
      ];

      mock.onGet("/productes").reply(200, initialProducts);

      const { result } = renderHook(() => useProducts(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.products).toHaveLength(1);
      });

      mock
        .onDelete("/productes/1")
        .reply(404, { message: "Product not found" });

      await expect(
        act(async () => {
          await result.current.deleteProduct("1");
        })
      ).rejects.toThrow();
    });
  });
});

