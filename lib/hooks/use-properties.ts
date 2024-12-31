import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Property, CreatePropertyInput, PropertyFormData } from '@/types/property'
import { Database } from '@/lib/supabase/types'

export function useProperties() {
  const supabase = createClientComponentClient<Database>()
  const queryClient = useQueryClient()

  const createPropertyMutation = useMutation({
    mutationFn: async (formData: PropertyFormData) => {
      const propertyData: CreatePropertyInput = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        price: formData.price,
        surface: formData.surface,
        rooms: formData.bedrooms || null,
        bedrooms: formData.bedrooms || null,
        bathrooms: formData.bathrooms || null,
        address: formData.district || null,
        city: formData.city,
        district: formData.district || null,
        postalCode: null,
        owner_id: 'user_id', // À remplacer par l'ID de l'utilisateur connecté
        status: 'published',
        features: formData.features || [],
        images: []
      }

      const { data, error: err } = await supabase
        .from('properties')
        .insert(propertyData)
        .select()
        .single()

      if (err) throw err

      // Upload des images si présentes
      if (formData.images) {
        const files = Array.from(formData.images)
        const imageUrls = await Promise.all(
          files.map(async (file) => {
            const path = `properties/${data.id}/${file.name}`
            const { error: uploadError } = await supabase.storage
              .from('properties')
              .upload(path, file)

            if (uploadError) throw uploadError
            return path
          })
        )

        // Mise à jour de la propriété avec les URLs des images
        const { error: updateError } = await supabase
          .from('properties')
          .update({ images: imageUrls })
          .eq('id', data.id)

        if (updateError) throw updateError
      }

      return data
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