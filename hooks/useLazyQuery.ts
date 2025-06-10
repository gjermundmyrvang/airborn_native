import { useState } from "react";
import { useQuery, UseQueryOptions, QueryKey, UseQueryResult } from "@tanstack/react-query";

export function useLazyQuery<TData = unknown, TError = unknown>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn" | "enabled">
): [UseQueryResult<TData, TError>, boolean, (expanded: boolean) => void] {
  const [expanded, setExpanded] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const handleToggle = (next: boolean) => {
    setExpanded(next);
    if (next && !hasFetched) setHasFetched(true);
  };

  const query = useQuery<TData, TError>({
    queryKey,
    queryFn,
    enabled: expanded || hasFetched,
    ...options,
  });

  return [query, expanded, handleToggle];
}