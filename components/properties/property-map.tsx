'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Property } from '@/types/property'
import { Button } from '@/components/ui/button'
import { Locate } from 'lucide-react'
import { useGeolocation } from '@/hooks/use-geolocation'
import { useToast } from '@/components/ui/use-toast'
import { useMap as useLeafletMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
)

interface PropertyMapProps {
  properties: Property[]
  center?: [number, number]
  zoom?: number
  onLocationChange?: (lat: number, lng: number) => void
}

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useLeafletMap()

  useEffect(() => {
    if (map) {
      map.setView(center, zoom)
    }
  }, [center, zoom, map])

  return null
}

function LocationButton() {
  const { toast } = useToast()
  const { getLocation } = useGeolocation()
  const map = useLeafletMap()

  const handleClick = async () => {
    try {
      const { latitude, longitude } = await getLocation()
      if (map) {
        map.setView([latitude, longitude], 13)
      }
    } catch (error) {
      toast({
        title: "Erreur de localisation",
        description: "Impossible d'obtenir votre position actuelle.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="leaflet-bottom leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <Button
          variant="outline"
          size="icon"
          className="bg-white hover:bg-gray-100"
          onClick={handleClick}
        >
          <Locate className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

const defaultIcon = {
  iconUrl: '/images/marker-icon.png',
  iconRetinaUrl: '/images/marker-icon-2x.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
}

export function PropertyMap({
  properties,
  center = [12.3714, -1.5197], // Coordonnées de Ouagadougou
  zoom = 13,
  onLocationChange
}: PropertyMapProps) {
  const [isClient, setIsClient] = useState(false)
  const [L, setL] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
    import('leaflet').then((mod) => {
      setL(mod.default)
    })
  }, [])

  if (!isClient || !L) {
    return <div className="h-[600px] bg-gray-100" />
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-[600px] w-full"
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater center={center} zoom={zoom} />
      <LocationButton />
      {properties.map((property) => (
        property.latitude && property.longitude ? (
          <Marker
            key={property.id}
            position={[property.latitude, property.longitude]}
            icon={L.icon(defaultIcon)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{property.title}</h3>
                <p className="text-sm text-gray-600">{property.price} FCFA</p>
              </div>
            </Popup>
          </Marker>
        ) : null
      ))}
    </MapContainer>
  )
}
