'use client'

import dynamic from 'next/dynamic'
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

const PropertyMapDynamic = dynamic(
  () => import('@/components/properties/property-map').then(mod => mod.PropertyMap),
  { ssr: false }
)
const PropertyCardDynamic = dynamic(
  () => import('@/components/properties/property-card').then(mod => mod.PropertyCard),
  { ssr: false }
)

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [view, setView] = useState<'grid' | 'map'>('grid')
  const [filters, setFilters] = useState({})
  const { getProperties, isLoading } = useProperties()

  useEffect(() => {
    async function loadProperties() {
      try {
        const data = await getProperties(filters)
        setProperties(data)
      } catch (error) {
        console.error('Erreur lors du chargement des propriétés:', error)
      }
    }

    loadProperties()
  }, [filters])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* En-tête avec les options de vue */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Rechercher un bien</h1>
          <div className="flex items-center gap-4">
            <Tabs value={view} onValueChange={(v) => setView(v as 'grid' | 'map')}>
              <TabsList>
                <TabsTrigger value="grid">
                  <Grid2X2 className="h-4 w-4 mr-2" />
                  Grille
                </TabsTrigger>
                <TabsTrigger value="map">
                  <Map className="h-4 w-4 mr-2" />
                  Carte
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Filtres */}
        <SearchFilters onFilterChange={setFilters} />

        {/* Contenu principal */}
        <div className="mt-6">
          {view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCardDynamic key={property.id} property={property} />
              ))}
              {properties.length === 0 && !isLoading && (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">
                    Aucun bien ne correspond à vos critères
                  </p>
                </div>
              )}
            </div>
          ) : (
            <PropertyMapDynamic properties={properties} />
          )}
        </div>
      </div>
    </div>
  )
}