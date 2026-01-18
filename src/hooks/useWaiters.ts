"use client";

import useSWR from "swr";
import { useSWRConfig } from "swr";
import { useCallback } from "react";
import { fetcher, defaultConfig } from "@/lib/swr";
import { waitersService, Waiter } from "@/services/waitersService";

const WAITERS_KEY = "/waiters";

interface WaitersResponse {
  data: Waiter[];
}

/**
 * SWR-based hook for waiters with automatic deduplication and caching
 * Multiple components using this hook will share the same request
 */
export const useWaiters = () => {
  const { mutate } = useSWRConfig();

  // Custom fetcher that handles the response format
  const waitersFetcher = async (): Promise<Waiter[]> => {
    const data = await fetcher<WaitersResponse>(WAITERS_KEY);
    return data.data ?? [];
  };

  const { data, error, isLoading, isValidating } = useSWR<Waiter[]>(
    WAITERS_KEY,
    waitersFetcher,
    defaultConfig,
  );

  // Mutation functions with optimistic updates
  const createWaiter = useCallback(
    async (
      waiter: Omit<Waiter, "id" | "createdAt" | "updatedAt" | "password">,
    ) => {
      const newWaiter = await waitersService.createWaiter(waiter);
      // Optimistically update the cache
      mutate(
        WAITERS_KEY,
        (current: Waiter[] | undefined) =>
          current ? [...current, newWaiter] : [newWaiter],
        { revalidate: false },
      );
      return newWaiter;
    },
    [mutate],
  );

  const updateWaiter = useCallback(
    async (id: string, waiter: Partial<Waiter>) => {
      const updatedWaiter = await waitersService.updateWaiter(id, waiter);
      // Optimistically update the cache
      mutate(
        WAITERS_KEY,
        (current: Waiter[] | undefined) =>
          current?.map((w) => (w.id === id ? updatedWaiter : w)) ?? [],
        { revalidate: false },
      );
      return updatedWaiter;
    },
    [mutate],
  );

  const deleteWaiter = useCallback(
    async (id: string) => {
      await waitersService.deleteWaiter(id);
      // Optimistically update the cache
      mutate(
        WAITERS_KEY,
        (current: Waiter[] | undefined) =>
          current?.filter((w) => w.id !== id) ?? [],
        { revalidate: false },
      );
    },
    [mutate],
  );

  const refetch = useCallback(() => {
    mutate(WAITERS_KEY);
  }, [mutate]);

  return {
    waiters: data ?? [],
    loading: isLoading,
    isValidating,
    error: error?.message ?? null,
    fetchWaiters: refetch,
    createWaiter,
    updateWaiter,
    deleteWaiter,
    setError: () => {}, // Kept for backward compatibility
  };
};
