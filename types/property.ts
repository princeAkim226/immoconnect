import { PropertyType as SupabasePropertyType } from '@/lib/supabase/types'

export type PropertyType = 'apartment' | 'house' | 'studio' | 'villa' | 'office' | 'land'

export type PropertyStatus = 'draft' | 'published' | 'archived'

export interface Property {
  id: string
  title: string
  description: string | null
  type: PropertyType
  price: number
  surface: number
  rooms: number | null
  bedrooms: number | null
  bathrooms: number | null
  address: string | null
  city: string
  district: string | null
  postalCode: string | null
  images: string[]
  features: string[]
  owner_id: string
  created_at: string
  updated_at: string
  status: PropertyStatus
  latitude: number | null
  longitude: number | null
}

export type CreatePropertyInput = Omit<Property, 'id' | 'created_at' | 'updated_at' | 'images' | 'features'> & {
  images?: string[]
  features?: string[]
}

export interface PropertyFormData {
  title: string
  description: string
  type: PropertyType
  price: number
  surface: number
  bedrooms?: number
  bathrooms?: number
  city: string
  district?: string
  features?: string[]
  images?: FileList
  latitude?: number
  longitude?: number
}
