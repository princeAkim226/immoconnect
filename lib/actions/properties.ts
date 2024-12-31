import { supabase } from "@/lib/supabase"
import { Property, CreatePropertyInput } from "@/types/property"

export async function createProperty(input: CreatePropertyInput): Promise<Property> {
  const { data: property, error } = await supabase
    .from('properties')
    .insert([input])
    .select()
    .single()

  if (error) {
    throw new Error(`Erreur lors de la création de la propriété: ${error.message}`)
  }

  return property
}

export async function updateProperty(
  id: string,
  data: Partial<CreatePropertyInput>
): Promise<Property> {
  const { data: property, error } = await supabase
    .from('properties')
    .update(data)
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
  type?: Property['type']
  city?: string
  minPrice?: number
  maxPrice?: number
  minSurface?: number
  maxSurface?: number
  status?: Property['status']
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
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
  }

  const { data: properties, error } = await query

  if (error) {
    throw new Error(`Erreur lors de la récupération des propriétés: ${error.message}`)
  }

  return properties
}
