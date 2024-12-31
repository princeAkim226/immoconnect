'use client'

import { useState, useEffect } from 'react'
import { SearchFilters } from "@/components/properties/search-filters"
import { PropertyCard } from "@/components/properties/property-card"
import { PropertyMap } from "@/components/properties/property-map"
import { useProperties } from "@/hooks/use-properties"
import { Property } from "@/types/property"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Grid2X2, Map } from "lucide-react"

type ViewType = 'grid' | 'map'

export function PropertiesClient() {
  const [properties, setProperties] = useState<Property[]>([])
  const [view, setView] = useState<ViewType>('grid')
  const [filters, setFilters] = useState({})
  const { getProperties } = useProperties()

  useEffect(() => {
    async function fetchProperties() {
      try {
        const data = await getProperties(filters)
        setProperties(data)
      } catch (error) {
        console.error('Error fetching properties:', error)
      }
    }

    fetchProperties()
  }, [filters, getProperties])

  const handleViewChange = (value: string) => {
    if (value === 'grid' || value === 'map') {
      setView(value as ViewType)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <SearchFilters onFilterChange={setFilters} />

        <div className="flex justify-end">
          <Tabs value={view} onValueChange={handleViewChange}>
            <TabsList>
              <TabsTrigger value="grid">
                <Grid2X2 className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="map">
                <Map className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="h-[600px]">
            <PropertyMap properties={properties} />
          </div>
        )}
      </div>
    </div>
  )
}
