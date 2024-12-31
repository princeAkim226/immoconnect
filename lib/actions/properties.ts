import { supabase } from "@/lib/supabase"
import { Property, PropertyType } from "@/types/property"

interface CreatePropertyData {
  owner_id: string
  title: string
  description: string
  type: PropertyType
  city: string
  district?: string
  price: number
  surface: number
  bedrooms?: number
  bathrooms?: number
  images?: any
  amenities?: string[]
  status?: 'draft' | 'published' | 'archived'
}

export async function createProperty(data: CreatePropertyData): Promise<Property> {
  const { data: property, error } = await supabase
    .from('properties')
    .insert([
      {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(`Erreur lors de la création de la propriété: ${error.message}`)
  }

  return property
}

export async function updateProperty(
  id: string,
  data: Partial<CreatePropertyData>
): Promise<Property> {
  const { data: property, error } = await supabase
    .from('properties')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Erreur lors de la mise à jour de la propriété: ${error.message}`)
  }

  return property
}

export async function deleteProperty(id: string): Promise<void> {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Erreur lors de la suppression de la propriété: ${error.message}`)
  }
}

export async function getProperty(id: string): Promise<Property> {
  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`Erreur lors de la récupération de la propriété: ${error.message}`)
  }

  return property
}

export async function getProperties(filters?: {
  type?: PropertyType
  city?: string
  minPrice?: number
  maxPrice?: number
  minSurface?: number
  maxSurface?: number
}): Promise<Property[]> {
  let query = supabase.from('properties').select('*')

  if (filters) {
    if (filters.type) {
      query = query.eq('type', filters.type)
    }
    if (filters.city) {
      query = query.eq('city', filters.city)
    }
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice)
    }
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice)
    }
    if (filters.minSurface) {
      query = query.gte('surface', filters.minSurface)
    }
    if (filters.maxSurface) {
      query = query.lte('surface', filters.maxSurface)
    }
  }

  const { data: properties, error } = await query

  if (error) {
    throw new Error(`Erreur lors de la récupération des propriétés: ${error.message}`)
  }

  return properties
}
