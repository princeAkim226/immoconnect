"use client"

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/supabase/types'

export function usePropertyImages() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient<Database>()

  const uploadImage = async (propertyId: string, file: File) => {
    setIsLoading(true)
    setError(null)

    try {
      const fileExt = file.name.split('.').pop()
      const filePath = `${propertyId}/${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath)

      const { error: dbError } = await supabase
        .from('property_images')
        .insert({
          property_id: propertyId,
          url: publicUrl
        })

      if (dbError) throw dbError

      return publicUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du téléchargement')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const deleteImage = async (propertyId: string, imageUrl: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error: dbError } = await supabase
        .from('property_images')
        .delete()
        .eq('property_id', propertyId)
        .eq('url', imageUrl)

      if (dbError) throw dbError

      const filePath = imageUrl.split('/').pop()
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from('property-images')
          .remove([`${propertyId}/${filePath}`])

        if (storageError) throw storageError
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    uploadImage,
    deleteImage
  }
}