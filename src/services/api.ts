const API_BASE_URL = 'http://localhost:3001';

export const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
};

export const fetchItems = async () => {
  return apiClient<{ data: any[] }>('/items');
};

export const createItem = async (data: any) => {
  return apiClient('/items', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
