// Example usage of TanStack Query hooks
// You can use this as a reference in your components

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Example custom hook for fetching data
export function useExampleData() {
  return useQuery({
    queryKey: ['example-data'],
    queryFn: async () => {
      const response = await fetch('/api/example')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
    // Optional: Add specific options for this query
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  })
}

// Example custom hook for mutations
export function useCreateExample() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newData) => {
      const response = await fetch('/api/example', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      })
      if (!response.ok) {
        throw new Error('Failed to create example')
      }
      return response.json()
    },
    // Invalidate and refetch example data after successful mutation
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['example-data'] })
    },
  })
}

// Example component usage:
// function MyComponent() {
//   const { data, isLoading, error } = useExampleData()
//   const createMutation = useCreateExample()
//
//   if (isLoading) return <div>Loading...</div>
//   if (error) return <div>Error: {error.message}</div>
//
//   return (
//     <div>
//       <pre>{JSON.stringify(data, null, 2)}</pre>
//       <button
//         onClick={() => createMutation.mutate({ name: 'New Item' })}
//         disabled={createMutation.isPending}
//       >
//         {createMutation.isPending ? 'Creating...' : 'Create Item'}
//       </button>
//     </div>
//   )
// }