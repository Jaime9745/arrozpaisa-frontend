import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import MockAdapter from "axios-mock-adapter";
import { apiClient } from "../../api/client";
import { useTables } from "../useTables";
import { Table } from "@/services/tablesService";
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

describe("useTables Hook", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(apiClient.getInstance());
    localStorage.clear();
  });

  afterEach(() => {
    mock.restore();
  });

  describe("initial fetch", () => {
    it("should fetch tables successfully on mount", async () => {
      const mockTables: Table[] = [
        {
          id: "1",
          number: 1,
          status: "libre",
          capacity: 4,
          location: "Interior",
        },
        {
          id: "2",
          number: 2,
          status: "atendida",
          capacity: 2,
          location: "Terraza",
        },
      ];

      mock.onGet("/tables").reply(200, { data: mockTables });

      const { result } = renderHook(() => useTables(), { wrapper: createWrapper() });

      // SWR starts with empty data
      expect(result.current.tables).toEqual([]);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.tables).toEqual(mockTables);
      expect(result.current.tables).toHaveLength(2);
      expect(result.current.error).toBeNull();
    });

    it("should handle fetch error", async () => {
      mock.onGet("/tables").reply(500, { message: "Server error" });

      const { result } = renderHook(() => useTables(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).not.toBeNull();
      expect(result.current.tables).toEqual([]);
    });
  });

  describe("refreshTables", () => {
    it("should refetch tables when calling refreshTables", async () => {
      const initialTables: Table[] = [
        {
          id: "1",
          number: 1,
          status: "libre",
          capacity: 4,
        },
      ];

      const updatedTables: Table[] = [
        {
          id: "1",
          number: 1,
          status: "libre",
          capacity: 4,
        },
        {
          id: "2",
          number: 2,
          status: "atendida",
          capacity: 2,
        },
      ];

      mock.onGet("/tables").replyOnce(200, { data: initialTables });

      const { result } = renderHook(() => useTables(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.tables).toHaveLength(1);
      });

      mock.onGet("/tables").replyOnce(200, { data: updatedTables });

      await act(async () => {
        await result.current.refreshTables();
      });

      await waitFor(() => {
        expect(result.current.tables).toHaveLength(2);
      });
    });

    it("should handle refresh error", async () => {
      const initialTables: Table[] = [
        {
          id: "1",
          number: 1,
          status: "libre",
          capacity: 4,
        },
      ];

      mock.onGet("/tables").replyOnce(200, { data: initialTables });

      const { result } = renderHook(() => useTables(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.tables).toHaveLength(1);
      });

      mock.onGet("/tables").replyOnce(500, { message: "Server error" });

      await act(async () => {
        await result.current.refreshTables();
      });

      // SWR keeps the previous data on error
      expect(result.current.tables).toHaveLength(1);
    });
  });

  describe("updateTableStatus", () => {
    it("should update table status to libre successfully", async () => {
      const initialTables: Table[] = [
        {
          id: "1",
          number: 1,
          status: "atendida",
          capacity: 4,
        },
      ];

      mock.onGet("/tables").reply(200, { data: initialTables });

      const { result } = renderHook(() => useTables(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.tables).toHaveLength(1);
      });

      const updatedTable: Table = {
        id: "1",
        number: 1,
        status: "libre",
        capacity: 4,
      };

      mock.onPut("/tables/1/status").reply(200, { data: updatedTable });

      await act(async () => {
        await result.current.updateTableStatus("1", "libre");
      });

      expect(result.current.tables[0].status).toBe("libre");
      expect(result.current.error).toBeNull();
    });

    it("should update table status to atendida successfully", async () => {
      const initialTables: Table[] = [
        {
          id: "1",
          number: 1,
          status: "libre",
          capacity: 4,
        },
      ];

      mock.onGet("/tables").reply(200, { data: initialTables });

      const { result } = renderHook(() => useTables(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.tables).toHaveLength(1);
      });

      const updatedTable: Table = {
        id: "1",
        number: 1,
        status: "atendida",
        capacity: 4,
      };

      mock.onPut("/tables/1/status").reply(200, { data: updatedTable });

      await act(async () => {
        await result.current.updateTableStatus("1", "atendida");
      });

      expect(result.current.tables[0].status).toBe("atendida");
      expect(result.current.error).toBeNull();
    });

    it("should update the correct table when multiple tables exist", async () => {
      const initialTables: Table[] = [
        {
          id: "1",
          number: 1,
          status: "libre",
          capacity: 4,
        },
        {
          id: "2",
          number: 2,
          status: "libre",
          capacity: 2,
        },
        {
          id: "3",
          number: 3,
          status: "libre",
          capacity: 6,
        },
      ];

      mock.onGet("/tables").reply(200, { data: initialTables });

      const { result } = renderHook(() => useTables(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.tables).toHaveLength(3);
      });

      const updatedTable: Table = {
        id: "2",
        number: 2,
        status: "atendida",
        capacity: 2,
      };

      mock.onPut("/tables/2/status").reply(200, { data: updatedTable });

      await act(async () => {
        await result.current.updateTableStatus("2", "atendida");
      });

      expect(result.current.tables[0].status).toBe("libre");
      expect(result.current.tables[1].status).toBe("atendida");
      expect(result.current.tables[2].status).toBe("libre");
    });

    it("should handle update table status error", async () => {
      const initialTables: Table[] = [
        {
          id: "1",
          number: 1,
          status: "libre",
          capacity: 4,
        },
      ];

      mock.onGet("/tables").reply(200, { data: initialTables });

      const { result } = renderHook(() => useTables(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.tables).toHaveLength(1);
      });

      mock.onPut("/tables/1/status").reply(404, { message: "Table not found" });

      await expect(
        act(async () => {
          await result.current.updateTableStatus("1", "atendida");
        })
      ).rejects.toThrow();
    });

    it("should handle unauthorized error when updating status", async () => {
      const initialTables: Table[] = [
        {
          id: "1",
          number: 1,
          status: "libre",
          capacity: 4,
        },
      ];

      mock.onGet("/tables").reply(200, { data: initialTables });

      const { result } = renderHook(() => useTables(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.tables).toHaveLength(1);
      });

      mock.onPut("/tables/1/status").reply(401, { message: "Unauthorized" });

      await expect(
        act(async () => {
          await result.current.updateTableStatus("1", "atendida");
        })
      ).rejects.toThrow();
    });
  });

  describe("loading states", () => {
    it("should set loading to false after successful fetch", async () => {
      mock.onGet("/tables").reply(200, { data: [] });

      const { result } = renderHook(() => useTables(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it("should set loading to false after failed fetch", async () => {
      mock.onGet("/tables").networkError();

      const { result } = renderHook(() => useTables(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });
});

