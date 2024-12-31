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

export const propertyTypes = [
  {
    label: "Villa",
    value: "villa",
    description: "Maison individuelle avec cour"
  },
  {
    label: "Appartement",
    value: "apartment",
    description: "Appartement dans un immeuble"
  },
  {
    label: "Chambre-salon",
    value: "studio",
    description: "Studio avec une chambre et un salon"
  },
  {
    label: "Célibatorium",
    value: "single_room",
    description: "Chambre simple"
  },
  {
    label: "Bureau",
    value: "office",
    description: "Espace de travail"
  },
  {
    label: "Boutique",
    value: "shop",
    description: "Local commercial"
  },
  {
    label: "Entrepôt",
    value: "warehouse",
    description: "Espace de stockage"
  }
] as const

export const amenities = [
  {
    label: "Climatisation",
    value: "ac"
  },
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
  {
    label: "Gardiennage",
    value: "security"
  }
] as const