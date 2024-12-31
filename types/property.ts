export type PropertyType = 'apartment' | 'house' | 'studio' | 'villa' | 'office' | 'land'

export interface Property {
  id: string
  title: string
  description: string
  type: PropertyType
  price: number
  surface: number
  rooms: number
  bedrooms: number
  bathrooms: number
  address: string
  city: string
  postalCode: string
  images: string[]
  features: string[]
  userId: string
  createdAt: string
  updatedAt: string
  status: 'draft' | 'published' | 'archived'
  latitude?: number
  longitude?: number
}

export interface PropertyFormData extends Omit<Property, 'id' | 'userId' | 'createdAt' | 'updatedAt'> {
  images: File[]
}
