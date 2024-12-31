import { PropertyType } from "@/types/property"

export const propertyTypes = [
  { value: "apartment" as PropertyType, label: "Appartement" },
  { value: "house" as PropertyType, label: "Maison" },
  { value: "studio" as PropertyType, label: "Studio" },
  { value: "villa" as PropertyType, label: "Villa" },
  { value: "office" as PropertyType, label: "Bureau" },
  { value: "land" as PropertyType, label: "Terrain" },
] as const

export const cities = [
  "Ouagadougou",
  "Bobo-Dioulasso",
  "Koudougou",
  "Banfora",
  "Ouahigouya",
  "Kaya",
  "Dédougou",
  "Fada N'gourma",
  "Tenkodogo",
  "Ziniaré"
] as const

export const districts = {
  "Ouagadougou": [
    "Ouaga 2000",
    "Zone du Bois",
    "Patte d'Oie",
    "Cissin",
    "Dassasgho",
    "Gounghin",
    "Kilwin",
    "Tanghin",
    "Tampouy",
    "Zogona"
  ],
  "Bobo-Dioulasso": [
    "Secteur 1",
    "Secteur 2",
    "Secteur 3",
    "Secteur 4",
    "Secteur 5",
    "Secteur 6",
    "Secteur 7",
    "Secteur 8",
    "Secteur 9",
    "Secteur 10"
  ]
} as const

export const amenities = [
  { value: "parking", label: "Parking" },
  { value: "garden", label: "Jardin" },
  { value: "pool", label: "Piscine" },
  { value: "security", label: "Sécurité" },
  { value: "air_conditioning", label: "Climatisation" },
  { value: "furnished", label: "Meublé" },
  {
    label: "Garage",
    value: "garage"
  },
  {
    label: "Groupe électrogène",
    value: "generator"
  },
  {
    label: "Forage",
    value: "water_pump"
  },
  {
    label: "Cuisine moderne",
    value: "modern_kitchen"
  },
] as const