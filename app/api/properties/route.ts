import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabase } from '@/lib/supabase'
import { authOptions } from '../auth/[...nextauth]/route'

// Fonction pour calculer la distance entre deux points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
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

  let query = supabase.from('properties').select('*')

  if (type && type !== 'all') query = query.eq('type', type)
  if (city && city !== 'all') query = query.eq('city', city)
  if (minPrice) query = query.gte('price', minPrice)
  if (maxPrice) query = query.lte('price', maxPrice)
  if (minSurface) query = query.gte('surface', minSurface)
  if (maxSurface) query = query.lte('surface', maxSurface)

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Filtrer par distance si les coordonnées sont fournies
  if (latitude && longitude && radius && data) {
    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)
    const rad = parseFloat(radius)

    const filteredData = data.filter(property => {
      if (!property.latitude || !property.longitude) return false
      
      const distance = calculateDistance(
        lat,
        lng,
        property.latitude,
        property.longitude
      )
      
      return distance <= rad
    })

    // Ajouter la distance à chaque propriété
    const propertiesWithDistance = filteredData.map(property => ({
      ...property,
      distance: calculateDistance(
        lat,
        lng,
        property.latitude,
        property.longitude
      )
    }))

    // Trier par distance
    propertiesWithDistance.sort((a, b) => a.distance - b.distance)

    return NextResponse.json(propertiesWithDistance)
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    )
  }

  try {
    const json = await request.json()
    const property = {
      ...json,
      user_id: session.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('properties')
      .insert([property])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
