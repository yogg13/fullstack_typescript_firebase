import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: data dianggap fresh untuk 5 menit
      staleTime: 5 * 60 * 1000, // 5 minutes

      // Cache time: data disimpan di memory untuk 10 menit
      gcTime: 10 * 60 * 1000, // 10 minutes (gcTime replaces cacheTime in v5)

      // Retry failed requests 3 kali dengan exponential backoff
      retry: 3,

      // Refetch saat window focus (berguna untuk real-time updates)
      refetchOnWindowFocus: false,

      // Refetch saat reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations 1 kali
      retry: 1,
    },
  },
});

// Query keys untuk konsistensi
export const queryKeys = {
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.products.details(), id] as const,
  },
} as const;
