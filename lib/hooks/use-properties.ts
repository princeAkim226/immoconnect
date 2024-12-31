import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Property, PropertyFormData } from '@/types/property'

export function useProperties() {
  const queryClient = useQueryClient()

  const createPropertyMutation = useMutation({
    mutationFn: async (formData: PropertyFormData) => {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create property')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
    }
  })

  return {
    isLoading: createPropertyMutation.isPending,
    error: createPropertyMutation.error?.message || null,
    createProperty: createPropertyMutation.mutate
  }
}