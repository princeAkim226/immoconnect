export type PropertyType = 'apartment' | 'house' | 'studio' | 'villa' | 'office' | 'land'

export type PropertyStatus = 'draft' | 'published' | 'archived'

export interface Property {
  id: string
  title: string
  description: string
  type: PropertyType
  price: number
  surface: number
  rooms?: number | null
  bedrooms?: number | null
  bathrooms?: number | null
  address?: string | null
  city: string
  district?: string | null
  postalCode?: string | null
  latitude?: number | null
  longitude?: number | null
  features: string[]
  images: string[]
  owner_id: string
  created_at: string
  updated_at: string
  status: PropertyStatus
}

export type CreatePropertyInput = Omit<
  Property,
  'id' | 'created_at' | 'updated_at' | 'owner_id'
>

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
  images?: File[] | null
  latitude?: number
  longitude?: number
}
