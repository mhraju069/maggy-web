"use client";

import { useCallback, useState } from "react";
import { ApiError } from "../lib/api/types";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  apiError: ApiError | null;
}

export function useApi<T, P extends unknown[] = unknown[]>(
  apiFunc: (...args: P) => Promise<T>
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    apiError: null,
  });

  const execute = useCallback(
    async (...args: P): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null, apiError: null }));

      try {
        const result = await apiFunc(...args);
        setState({
          data: result,
          loading: false,
          error: null,
          apiError: null,
        });
        return result;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
            ? err.message
            : "An unexpected error occurred.";

        const apiErrorObj = err instanceof ApiError ? err : null;

        setState({
          data: null,
          loading: false,
          error: errorMessage,
          apiError: apiErrorObj,
        });
        return null;
      }
    },
    [apiFunc]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      apiError: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

export default useApi;
