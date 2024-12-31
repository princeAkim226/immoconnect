import { Property, CreatePropertyInput } from "@/types/property"

export async function createProperty(input: CreatePropertyInput): Promise<Property> {
  const response = await fetch('/api/properties', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error('Failed to create property')
  }

  return response.json()
}

export async function updateProperty(
  id: string,
  data: Partial<CreatePropertyInput>
): Promise<Property> {
  const response = await fetch(`/api/properties/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to update property')
  }

  return response.json()
}

export async function deleteProperty(id: string): Promise<void> {
  const response = await fetch(`/api/properties/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete property')
  }
}

export async function getProperty(id: string): Promise<Property> {
  const response = await fetch(`/api/properties/${id}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch property')
  }

  return response.json()
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
  let query = '/api/properties'

  if (filters) {
    const params = new URLSearchParams()
    if (filters.type) {
      params.set('type', filters.type)
    }
    if (filters.city) {
      params.set('city', filters.city)
    }
    if (filters.minPrice) {
      params.set('minPrice', String(filters.minPrice))
    }
    if (filters.maxPrice) {
      params.set('maxPrice', String(filters.maxPrice))
    }
    if (filters.minSurface) {
      params.set('minSurface', String(filters.minSurface))
    }
    if (filters.maxSurface) {
      params.set('maxSurface', String(filters.maxSurface))
    }
    if (filters.status) {
      params.set('status', filters.status)
    }
    query += `?${params.toString()}`
  }

  const response = await fetch(query)
  
  if (!response.ok) {
    throw new Error('Failed to fetch properties')
  }

  return response.json()
}
