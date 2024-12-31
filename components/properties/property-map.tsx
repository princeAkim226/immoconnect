'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Property } from '@/types/property'
import { Button } from '@/components/ui/button'
import { Locate } from 'lucide-react'
import { useGeolocation } from '@/hooks/use-geolocation'
import { useToast } from '@/components/ui/use-toast'

// Correction des icônes Leaflet pour Next.js
const icon = L.icon({
  iconUrl: '/images/marker-icon.png',
  iconRetinaUrl: '/images/marker-icon-2x.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const userIcon = L.icon({
  iconUrl: '/images/user-marker.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
})

interface PropertyMapProps {
  properties: Property[]
  center?: [number, number]
  zoom?: number
  onLocationChange?: (lat: number, lng: number) => void
}

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  
  return null
}

function LocationButton() {
  const map = useMap()
  const { latitude, longitude, error, isLoading } = useGeolocation()
  const { toast } = useToast()
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  const handleLocationClick = () => {
    if (error) {
      toast({
        title: "Erreur de géolocalisation",
        description: error,
        variant: "destructive"
      })
      return
    }

    if (latitude && longitude) {
      const location: [number, number] = [latitude, longitude]
      setUserLocation(location)
      map.flyTo(location, 15)
    }
  }

  return (
    <div className="leaflet-bottom leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <Button
          size="icon"
          variant="outline"
          className="bg-background h-10 w-10"
          onClick={handleLocationClick}
          disabled={isLoading}
        >
          <Locate className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function PropertyMap({ 
  properties,
  center = [12.3714, -1.5197], // Coordonnées de Ouagadougou
  zoom = 13,
  onLocationChange
}: PropertyMapProps) {
  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
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
              icon={icon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{property.title}</h3>
                  <p className="text-sm text-muted-foreground">{property.price.toLocaleString()} FCFA</p>
                  <p className="text-sm text-muted-foreground">{property.surface} m²</p>
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
    </div>
  )
}
