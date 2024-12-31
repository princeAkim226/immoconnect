import { NextResponse } from 'next/server'
import { properties } from '@/lib/data'
import { Property } from '@/types/property'

// Fonction pour calculer la distance entre deux points
function calculateDistance(lat1: number, lon1: number, lat2: number | null | undefined, lon2: number | null | undefined): number {
  if (lat2 === null || lat2 === undefined || lon2 === null || lon2 === undefined) return Infinity

  const R = 6371 // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const city = searchParams.get('city')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const minSurface = searchParams.get('minSurface')
  const maxSurface = searchParams.get('maxSurface')
  const latitude = searchParams.get('latitude')
  const longitude = searchParams.get('longitude')
  const radius = searchParams.get('radius') // rayon en km

  let filteredProperties = [...properties]

  if (type) {
    filteredProperties = filteredProperties.filter(p => p.type === type)
  }
  if (city) {
    filteredProperties = filteredProperties.filter(p => p.city.toLowerCase().includes(city.toLowerCase()))
  }
  if (minPrice) {
    filteredProperties = filteredProperties.filter(p => p.price >= Number(minPrice))
  }
  if (maxPrice) {
    filteredProperties = filteredProperties.filter(p => p.price <= Number(maxPrice))
  }
  if (minSurface) {
    filteredProperties = filteredProperties.filter(p => p.surface >= Number(minSurface))
  }
  if (maxSurface) {
    filteredProperties = filteredProperties.filter(p => p.surface <= Number(maxSurface))
  }

  // Filtrer par distance si les coordonnées sont fournies
  if (latitude && longitude && radius) {
    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)
    const rad = parseFloat(radius)

    const propertiesWithDistance = filteredProperties
      .map(property => ({
        ...property,
        distance: calculateDistance(lat, lng, property.latitude, property.longitude)
      }))
      .filter(property => property.distance <= rad)
      .sort((a, b) => a.distance - b.distance)

    return NextResponse.json(propertiesWithDistance)
  }

  return NextResponse.json(filteredProperties)
}

export async function POST(request: Request) {
  const data = await request.json()
  const newProperty: Property = {
    ...data,
    id: String(properties.length + 1),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    owner_id: 'user1',
    status: 'published'
  }

  properties.push(newProperty)
  return NextResponse.json(newProperty)
}
