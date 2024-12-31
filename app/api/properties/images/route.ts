import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabase } from '@/lib/supabase'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const propertyId = formData.get('propertyId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Générer un nom de fichier unique
    const fileName = `${propertyId}/${Date.now()}-${file.name}`
    
    // Télécharger le fichier vers Supabase Storage
    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(fileName, file)

    if (error) throw error

    // Obtenir l'URL publique de l'image
    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(fileName)

    // Mettre à jour la propriété avec la nouvelle image
    const { data: property } = await supabase
      .from('properties')
      .select('images')
      .eq('id', propertyId)
      .single()

    const currentImages = property?.images || []
    const updatedImages = [...currentImages, publicUrl]

    const { data: updatedProperty, error: updateError } = await supabase
      .from('properties')
      .update({
        images: updatedImages
      })
      .eq('id', propertyId)

    if (updateError) throw updateError

    return NextResponse.json({ url: publicUrl })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
