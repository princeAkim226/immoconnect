import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Bed, Bath, Square } from "lucide-react"

interface PropertyCardProps {
  id: string
  title: string
  type: string
  location: string
  price: number
  bedrooms?: number
  bathrooms?: number
  surface: number
  imageUrl: string
}

export function PropertyCard({
  id,
  title,
  type,
  location,
  price,
  bedrooms,
  bathrooms,
  surface,
  imageUrl
}: PropertyCardProps) {
  return (
    <Link href={`/properties/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
          <Badge className="absolute top-2 right-2">{type}</Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <div className="flex items-center text-muted-foreground mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{location}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            {bedrooms && (
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>{bedrooms}</span>
              </div>
            )}
            {bathrooms && (
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{bathrooms}</span>
              </div>
            )}
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span>{surface} m²</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-lg font-bold">{price.toLocaleString()} FCFA/mois</p>
        </CardFooter>
      </Card>
    </Link>
  )
}