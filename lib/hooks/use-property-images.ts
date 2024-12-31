"use client"

import { useState } from 'react'

export function usePropertyImages() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadImages = async (files: FileList, propertyId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      Array.from(files).forEach(file => {
        formData.append('files', file)
      })
      formData.append('propertyId', propertyId)

      const response = await fetch('/api/properties/images', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload images')
      }

      const data = await response.json()
      return data.urls
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload images')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    uploadImages,
    isLoading,
    error
  }
}