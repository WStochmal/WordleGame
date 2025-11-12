// --- lib ---
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

// --- types ---
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../../types/apiResponse.type";

export function useApiQuery<T>(
  key: unknown[],
  query: () => Promise<AxiosResponse<ApiResponse<T>>>,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">
) {
  return useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      const response = await query();
      return response.data.data;
    },
    ...options,
  });
}
