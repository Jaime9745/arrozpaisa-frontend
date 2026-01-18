"use client";

import useSWR from "swr";
import { useSWRConfig } from "swr";
import { useCallback } from "react";
import { fetcher, realtimeConfig } from "@/lib/swr";
import { tablesService, Table } from "@/services/tablesService";

const TABLES_KEY = "/tables";

interface TablesResponse {
  data: Table[];
}

/**
 * SWR-based hook for tables with automatic deduplication and caching
 * Uses realtime config for frequent updates (table status changes)
 */
export const useTables = () => {
  const { mutate } = useSWRConfig();

  // Custom fetcher that handles the response format
  const tablesFetcher = async (): Promise<Table[]> => {
    const data = await fetcher<TablesResponse>(TABLES_KEY);
    return data.data ?? [];
  };

  const { data, error, isLoading, isValidating } = useSWR<Table[]>(
    TABLES_KEY,
    tablesFetcher,
    realtimeConfig,
  );

  const refreshTables = useCallback(async () => {
    await mutate(TABLES_KEY);
  }, [mutate]);

  const updateTableStatus = useCallback(
    async (id: string, status: "libre" | "atendida") => {
      const updatedTable = await tablesService.updateTableStatus(id, status);
      // Optimistically update the cache
      mutate(
        TABLES_KEY,
        (current: Table[] | undefined) =>
          current?.map((table) => (table.id === id ? updatedTable : table)) ??
          [],
        { revalidate: false },
      );
    },
    [mutate],
  );

  return {
    tables: data ?? [],
    loading: isLoading,
    isValidating,
    error: error?.message ?? null,
    refreshTables,
    updateTableStatus,
  };
};
