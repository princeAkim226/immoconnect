import { useState } from 'react'
import { Property } from '@/types/property'

interface UsePropertiesOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useProperties(options: UsePropertiesOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  async function getProperties(filters?: Record<string, string>) {
    setIsLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams(filters)
      const response = await fetch(`/api/properties?${queryParams}`)
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des propriétés')
      }

      const data = await response.json()
      return data
    } catch (err: any) {
      setError(err)
      options.onError?.(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function createProperty(property: Omit<Property, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(property),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la propriété')
      }

      const data = await response.json()
      options.onSuccess?.()
      return data
    } catch (err: any) {
      setError(err)
      options.onError?.(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function uploadPropertyImages(propertyId: string, images: File[]) {
    setIsLoading(true)
    setError(null)

    try {
      const uploadPromises = images.map(async (image) => {
        const formData = new FormData()
        formData.append('file', image)
        formData.append('propertyId', propertyId)

        const response = await fetch('/api/properties/images', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Erreur lors du téléchargement des images')
        }

        return response.json()
      })

      const results = await Promise.all(uploadPromises)
      return results
    } catch (err: any) {
      setError(err)
      options.onError?.(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    getProperties,
    createProperty,
    uploadPropertyImages,
  }
}
