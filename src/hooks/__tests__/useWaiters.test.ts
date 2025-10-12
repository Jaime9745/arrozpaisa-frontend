import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import MockAdapter from "axios-mock-adapter";
import { apiClient } from "../../api/client";
import { useWaiters } from "../useWaiters";
import { Waiter } from "@/services/waitersService";

describe("useWaiters Hook", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(apiClient.getInstance());
    localStorage.clear();
  });

  afterEach(() => {
    mock.restore();
  });

  describe("fetchWaiters", () => {
    it("should fetch waiters successfully on mount", async () => {
      const mockWaiters: Waiter[] = [
        {
          id: "1",
          firstName: "Juan",
          lastName: "Pérez",
          identificationNumber: "123456789",
          phoneNumber: "3001234567",
          userName: "juanperez",
          isActive: true,
        },
        {
          id: "2",
          firstName: "María",
          lastName: "González",
          identificationNumber: "987654321",
          phoneNumber: "3009876543",
          userName: "mariagonzalez",
          isActive: true,
        },
      ];

      mock.onGet("/waiters").reply(200, { data: mockWaiters });

      const { result } = renderHook(() => useWaiters());

      expect(result.current.loading).toBe(true);
      expect(result.current.waiters).toEqual([]);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.waiters).toEqual(mockWaiters);
      expect(result.current.waiters).toHaveLength(2);
      expect(result.current.error).toBeNull();
    });

    it("should handle fetch error", async () => {
      mock.onGet("/waiters").reply(500, { message: "Server error" });

      const { result } = renderHook(() => useWaiters());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe("Error al cargar los meseros");
      expect(result.current.waiters).toEqual([]);
    });

    it("should refetch waiters when calling fetchWaiters", async () => {
      const initialWaiters: Waiter[] = [
        {
          id: "1",
          firstName: "Juan",
          lastName: "Pérez",
          identificationNumber: "123456789",
          phoneNumber: "3001234567",
          userName: "juanperez",
          isActive: true,
        },
      ];

      const updatedWaiters: Waiter[] = [
        ...initialWaiters,
        {
          id: "2",
          firstName: "María",
          lastName: "González",
          identificationNumber: "987654321",
          phoneNumber: "3009876543",
          userName: "mariagonzalez",
          isActive: true,
        },
      ];

      mock.onGet("/waiters").replyOnce(200, { data: initialWaiters });

      const { result } = renderHook(() => useWaiters());

      await waitFor(() => {
        expect(result.current.waiters).toHaveLength(1);
      });

      mock.onGet("/waiters").replyOnce(200, { data: updatedWaiters });

      await act(async () => {
        await result.current.fetchWaiters();
      });

      expect(result.current.waiters).toHaveLength(2);
    });
  });

  describe("createWaiter", () => {
    it("should create a new waiter successfully", async () => {
      mock.onGet("/waiters").reply(200, { data: [] });

      const { result } = renderHook(() => useWaiters());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newWaiter = {
        firstName: "Carlos",
        lastName: "Rodríguez",
        identificationNumber: "111222333",
        phoneNumber: "3001112233",
        userName: "carlosrodriguez",
      };

      const createdWaiter: Waiter = {
        id: "123",
        ...newWaiter,
        isActive: true,
      };

      mock.onPost("/waiters").reply(200, { data: createdWaiter });

      let createdResult: Waiter | undefined;

      await act(async () => {
        createdResult = await result.current.createWaiter(newWaiter);
      });

      expect(createdResult).toEqual(createdWaiter);
      expect(result.current.waiters).toHaveLength(1);
      expect(result.current.waiters[0].firstName).toBe("Carlos");
      expect(result.current.error).toBeNull();
    });

    it("should handle create waiter error", async () => {
      mock.onGet("/waiters").reply(200, { data: [] });

      const { result } = renderHook(() => useWaiters());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newWaiter = {
        firstName: "",
        lastName: "",
        identificationNumber: "123",
        phoneNumber: "invalid",
        userName: "test",
      };

      mock.onPost("/waiters").reply(400, { message: "Validation error" });

      await act(async () => {
        try {
          await result.current.createWaiter(newWaiter);
        } catch (error) {
          // Expected error
        }
      });

      expect(result.current.error).toBe("Error al crear el mesero");
      expect(result.current.waiters).toHaveLength(0);
    });
  });

  describe("updateWaiter", () => {
    it("should update a waiter successfully", async () => {
      const initialWaiters: Waiter[] = [
        {
          id: "1",
          firstName: "Juan",
          lastName: "Pérez",
          identificationNumber: "123456789",
          phoneNumber: "3001234567",
          userName: "juanperez",
          isActive: true,
        },
      ];

      mock.onGet("/waiters").reply(200, { data: initialWaiters });

      const { result } = renderHook(() => useWaiters());

      await waitFor(() => {
        expect(result.current.waiters).toHaveLength(1);
      });

      const updates = {
        firstName: "Juan Carlos",
        phoneNumber: "3009998887",
      };

      const updatedWaiter: Waiter = {
        id: "1",
        firstName: "Juan Carlos",
        lastName: "Pérez",
        identificationNumber: "123456789",
        phoneNumber: "3009998887",
        userName: "juanperez",
        isActive: true,
      };

      mock.onPut("/waiters/1").reply(200, { data: updatedWaiter });

      await act(async () => {
        await result.current.updateWaiter("1", updates);
      });

      expect(result.current.waiters[0].firstName).toBe("Juan Carlos");
      expect(result.current.waiters[0].phoneNumber).toBe("3009998887");
      expect(result.current.error).toBeNull();
    });

    it("should handle update waiter error", async () => {
      const initialWaiters: Waiter[] = [
        {
          id: "1",
          firstName: "Juan",
          lastName: "Pérez",
          identificationNumber: "123456789",
          phoneNumber: "3001234567",
          userName: "juanperez",
          isActive: true,
        },
      ];

      mock.onGet("/waiters").reply(200, { data: initialWaiters });

      const { result } = renderHook(() => useWaiters());

      await waitFor(() => {
        expect(result.current.waiters).toHaveLength(1);
      });

      mock.onPut("/waiters/1").reply(404, { message: "Waiter not found" });

      await act(async () => {
        try {
          await result.current.updateWaiter("1", { firstName: "New Name" });
        } catch (error) {
          // Expected error
        }
      });

      expect(result.current.error).toBe("Error al actualizar el mesero");
    });
  });

  describe("deleteWaiter", () => {
    it("should delete a waiter successfully", async () => {
      const initialWaiters: Waiter[] = [
        {
          id: "1",
          firstName: "Juan",
          lastName: "Pérez",
          identificationNumber: "123456789",
          phoneNumber: "3001234567",
          userName: "juanperez",
          isActive: true,
        },
        {
          id: "2",
          firstName: "María",
          lastName: "González",
          identificationNumber: "987654321",
          phoneNumber: "3009876543",
          userName: "mariagonzalez",
          isActive: true,
        },
      ];

      mock.onGet("/waiters").reply(200, { data: initialWaiters });

      const { result } = renderHook(() => useWaiters());

      await waitFor(() => {
        expect(result.current.waiters).toHaveLength(2);
      });

      mock.onDelete("/waiters/1").reply(204);

      await act(async () => {
        await result.current.deleteWaiter("1");
      });

      expect(result.current.waiters).toHaveLength(1);
      expect(result.current.waiters[0].id).toBe("2");
      expect(result.current.error).toBeNull();
    });

    it("should handle delete waiter error", async () => {
      const initialWaiters: Waiter[] = [
        {
          id: "1",
          firstName: "Juan",
          lastName: "Pérez",
          identificationNumber: "123456789",
          phoneNumber: "3001234567",
          userName: "juanperez",
          isActive: true,
        },
      ];

      mock.onGet("/waiters").reply(200, { data: initialWaiters });

      const { result } = renderHook(() => useWaiters());

      await waitFor(() => {
        expect(result.current.waiters).toHaveLength(1);
      });

      mock.onDelete("/waiters/1").reply(404, { message: "Waiter not found" });

      await act(async () => {
        try {
          await result.current.deleteWaiter("1");
        } catch (error) {
          // Expected error
        }
      });

      expect(result.current.error).toBe("Error al eliminar el mesero");
      expect(result.current.waiters).toHaveLength(1);
    });
  });

  describe("setError", () => {
    it("should allow manual error setting", async () => {
      mock.onGet("/waiters").reply(200, { data: [] });

      const { result } = renderHook(() => useWaiters());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setError("Custom error message");
      });

      expect(result.current.error).toBe("Custom error message");
    });
  });
});
