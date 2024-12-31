export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PropertyType = 'apartment' | 'house' | 'studio' | 'villa' | 'office' | 'land'

export interface Database {
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
          rooms: number | null
          address: string | null
          postalCode: string | null
          images: string[] | null
          features: string[] | null
          created_at: string
          updated_at: string
          owner_id: string
          status: 'draft' | 'published' | 'archived'
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
          rooms?: number | null
          address?: string | null
          postalCode?: string | null
          images?: string[] | null
          features?: string[] | null
          created_at?: string
          updated_at?: string
          owner_id: string
          status?: 'draft' | 'published' | 'archived'
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
          rooms?: number | null
          address?: string | null
          postalCode?: string | null
          images?: string[] | null
          features?: string[] | null
          created_at?: string
          updated_at?: string
          owner_id?: string
          status?: 'draft' | 'published' | 'archived'
        }
      }
      messages: {
        Row: {
          id: string
          content: string
          sender_id: string
          receiver_id: string
          property_id: string
          created_at: string
          read: boolean
        }
        Insert: {
          id?: string
          content: string
          sender_id: string
          receiver_id: string
          property_id: string
          created_at?: string
          read?: boolean
        }
        Update: {
          id?: string
          content?: string
          sender_id?: string
          receiver_id?: string
          property_id?: string
          created_at?: string
          read?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}