"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"
import { PropertyType } from '@/types/property'
import { useGeolocation } from '@/hooks/use-geolocation'

const propertyTypes: { value: PropertyType; label: string }[] = [
  { value: 'apartment', label: 'Appartement' },
  { value: 'house', label: 'Maison' },
  { value: 'studio', label: 'Studio' },
  { value: 'villa', label: 'Villa' },
  { value: 'office', label: 'Bureau' },
  { value: 'land', label: 'Terrain' },
]

const cities = [
  'Ouagadougou',
  'Bobo-Dioulasso',
  'Koudougou',
  'Banfora',
  'Ouahigouya',
]

interface SearchFiltersProps {
  onFilterChange: (filters: any) => void
}

export function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState({
    type: 'all',
    city: 'all',
    minPrice: '',
    maxPrice: '',
    minSurface: '',
    maxSurface: '',
    bedrooms: 'all',
    bathrooms: 'all',
    radius: '',
    latitude: '',
    longitude: '',
  })

  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [surfaceRange, setSurfaceRange] = useState([0, 500])
  const [radiusRange, setRadiusRange] = useState(5)
  const { latitude, longitude } = useGeolocation()

  useEffect(() => {
    if (latitude && longitude) {
      setFilters(prev => ({
        ...prev,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      }))
    }
  }, [latitude, longitude])

  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="bg-card rounded-lg border p-6 space-y-6">
      <Accordion type="single" collapsible defaultValue="filters">
        <AccordionItem value="filters">
          <AccordionTrigger>Filtres de recherche</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {/* Type de bien */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Type de bien</label>
                <Select
                  value={filters.type}
                  onValueChange={(value) => handleFilterChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ville */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Ville</label>
                <Select
                  value={filters.city}
                  onValueChange={(value) => handleFilterChange('city', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les villes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les villes</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Prix */}
              <div className="space-y-4">
                <label className="text-sm font-medium">
                  Prix (FCFA): {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}
                </label>
                <Slider
                  min={0}
                  max={1000000}
                  step={10000}
                  value={priceRange}
                  onValueChange={(value) => {
                    setPriceRange(value as number[])
                    handleFilterChange('minPrice', value[0].toString())
                    handleFilterChange('maxPrice', value[1].toString())
                  }}
                />
              </div>

              {/* Surface */}
              <div className="space-y-4">
                <label className="text-sm font-medium">
                  Surface (m²): {surfaceRange[0]} - {surfaceRange[1]}
                </label>
                <Slider
                  min={0}
                  max={500}
                  step={10}
                  value={surfaceRange}
                  onValueChange={(value) => {
                    setSurfaceRange(value as number[])
                    handleFilterChange('minSurface', value[0].toString())
                    handleFilterChange('maxSurface', value[1].toString())
                  }}
                />
              </div>

              {/* Rayon de recherche */}
              {latitude && longitude && (
                <div className="space-y-4">
                  <label className="text-sm font-medium">
                    Rayon de recherche: {radiusRange} km
                  </label>
                  <Slider
                    min={1}
                    max={50}
                    step={1}
                    value={[radiusRange]}
                    onValueChange={(value) => {
                      setRadiusRange(value[0])
                      handleFilterChange('radius', value[0].toString())
                    }}
                  />
                  <p className="text-sm text-muted-foreground">
                    Rechercher dans un rayon de {radiusRange} km autour de ma position
                  </p>
                </div>
              )}

              {/* Chambres et salles de bain */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Chambres</label>
                  <Select
                    value={filters.bedrooms}
                    onValueChange={(value) => handleFilterChange('bedrooms', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Peu importe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Peu importe</SelectItem>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}+
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Salles de bain</label>
                  <Select
                    value={filters.bathrooms}
                    onValueChange={(value) => handleFilterChange('bathrooms', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Peu importe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Peu importe</SelectItem>
                      {[1, 2, 3, 4].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}+
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => {
            setFilters({
              type: 'all',
              city: 'all',
              minPrice: '',
              maxPrice: '',
              minSurface: '',
              maxSurface: '',
              bedrooms: 'all',
              bathrooms: 'all',
              radius: '',
              latitude: '',
              longitude: '',
            })
            setPriceRange([0, 1000000])
            setSurfaceRange([0, 500])
            setRadiusRange(5)
          }}
        >
          Réinitialiser les filtres
        </Button>
      </div>
    </div>
  )
}