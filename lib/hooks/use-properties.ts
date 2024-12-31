"use client"

import { useState } from 'react'
import { Database } from '@/lib/supabase/types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type Property = Database['public']['Tables']['properties']['Row']

export function useProperties() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient<Database>()

  const fetchProperties = async (filters?: {
    city?: string
    type?: string
    minPrice?: number
    maxPrice?: number
    amenities?: string[]
  }) => {
    setIsLoading(true)
    setError(null)
    
    try {
      let query = supabase
        .from('properties')
        .select(`
          *,
          property_images (*),
          property_amenities (*)
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false })

      if (filters?.city) {
        query = query.eq('city', filters.city)
      }
      if (filters?.type) {
        query = query.eq('type', filters.type)
      }
      if (filters?.minPrice) {
        query = query.gte('price', filters.minPrice)
      }
      if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice)
      }
      if (filters?.amenities?.length) {
        query = query.contains('amenities', filters.amenities)
      }

      const { data, error: err } = await query

      if (err) throw err
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const createProperty = async (property: Database['public']['Tables']['properties']['Insert']) => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: err } = await supabase
        .from('properties')
        .insert(property)
        .select()
        .single()

      if (err) throw err
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const updateProperty = async (
    id: string,
    updates: Database['public']['Tables']['properties']['Update']
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: err } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (err) throw err
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    fetchProperties,
    createProperty,
    updateProperty
  }
}