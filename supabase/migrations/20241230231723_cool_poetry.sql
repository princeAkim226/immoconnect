/*
  # Schéma initial pour la plateforme immobilière

  1. Nouvelles Tables
    - `properties`
      - Informations de base sur les propriétés
      - Relations avec les commodités et les images
    - `property_amenities`
      - Table de liaison pour les commodités
    - `property_images`
      - Stockage des URLs des images
    
  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques pour la lecture publique
    - Politiques pour la modification par les propriétaires
*/

-- Création de l'enum pour les types de propriétés
CREATE TYPE property_type AS ENUM (
  'villa',
  'apartment',
  'studio',
  'single_room',
  'office',
  'shop',
  'warehouse'
);

-- Table principale des propriétés
CREATE TABLE properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type property_type NOT NULL,
  city text NOT NULL,
  district text,
  price integer NOT NULL CHECK (price >= 0),
  surface numeric NOT NULL CHECK (surface > 0),
  bedrooms smallint,
  bathrooms smallint,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'available' CHECK (status IN ('available', 'rented', 'archived'))
);

-- Table des images
CREATE TABLE property_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  "order" smallint DEFAULT 0
);

-- Table des commodités
CREATE TABLE property_amenities (
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  amenity text NOT NULL CHECK (amenity IN ('ac', 'garage', 'generator', 'water_pump', 'modern_kitchen', 'security')),
  PRIMARY KEY (property_id, amenity)
);

-- Activation RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_amenities ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité pour properties
CREATE POLICY "Properties are viewable by everyone" 
  ON properties FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own properties" 
  ON properties FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own properties" 
  ON properties FOR UPDATE
  USING (auth.uid() = owner_id);

-- Politiques pour les images
CREATE POLICY "Property images are viewable by everyone" 
  ON property_images FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert images to their properties" 
  ON property_images FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE id = property_images.property_id 
      AND owner_id = auth.uid()
    )
  );

-- Politiques pour les commodités
CREATE POLICY "Property amenities are viewable by everyone" 
  ON property_amenities FOR SELECT 
  USING (true);

CREATE POLICY "Users can manage amenities of their properties" 
  ON property_amenities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE id = property_amenities.property_id 
      AND owner_id = auth.uid()
    )
  );

-- Trigger pour mise à jour automatique
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();