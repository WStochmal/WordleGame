// --- lib ---
import { useMutation } from "@tanstack/react-query";

export const useApiMutation = <TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  onSuccess?: (data: TData) => void,
  onError?: (error: unknown) => void
) => {
  return useMutation<TData, unknown, TVariables>({
    mutationFn,
    onSuccess,
    onError,
  });
};
