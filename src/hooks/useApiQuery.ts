import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const useApiQuery = <TData, TError = Error>(
  queryKey: unknown[],
  url: string,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<TData, TError>(
    queryKey,
    async () => {
      const response = await fetch(`http://localhost:3001${url}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    options
  );
};
