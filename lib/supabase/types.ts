export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          title: string
          description: string | null
          type: PropertyType
          city: string
          district: string | null
          price: number
          surface: number
          bedrooms: number | null
          bathrooms: number | null
          created_at: string
          updated_at: string
          owner_id: string
          status: 'available' | 'rented' | 'archived'
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          type: PropertyType
          city: string
          district?: string | null
          price: number
          surface: number
          bedrooms?: number | null
          bathrooms?: number | null
          created_at?: string
          updated_at?: string
          owner_id: string
          status?: 'available' | 'rented' | 'archived'
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          type?: PropertyType
          city?: string
          district?: string | null
          price?: number
          surface?: number
          bedrooms?: number | null
          bathrooms?: number | null
          created_at?: string
          updated_at?: string
          owner_id?: string
          status?: 'available' | 'rented' | 'archived'
        }
      }
      property_images: {
        Row: {
          id: string
          property_id: string
          url: string
          created_at: string
          order: number
        }
        Insert: {
          id?: string
          property_id: string
          url: string
          created_at?: string
          order?: number
        }
        Update: {
          id?: string
          property_id?: string
          url?: string
          created_at?: string
          order?: number
        }
      }
      property_amenities: {
        Row: {
          property_id: string
          amenity: string
        }
        Insert: {
          property_id: string
          amenity: string
        }
        Update: {
          property_id?: string
          amenity?: string
        }
      }
    }
    Enums: {
      property_type: PropertyType
    }
  }
}

export type PropertyType = 
  | 'villa'
  | 'apartment'
  | 'studio'
  | 'single_room'
  | 'office'
  | 'shop'
  | 'warehouse'