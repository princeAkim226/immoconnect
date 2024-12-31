import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  // Dans une version statique, nous simulons simplement le stockage d'images
  // et retournons des URLs factices
  const formData = await request.formData()
  const files = formData.getAll('files') as File[]

  const imageUrls = files.map((_, index) => 
    `/images/property-${Date.now()}-${index}.jpg`
  )

  return NextResponse.json({ urls: imageUrls })
}
