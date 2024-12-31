import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

const messages = [
  {
    id: '1',
    conversationId: '1',
    senderId: '1',
    content: 'Bonjour, je suis intéressé par votre bien',
    createdAt: new Date().toISOString(),
    readAt: null
  }
]

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get('conversationId')

  if (!conversationId) {
    return NextResponse.json({ error: 'ID de conversation requis' }, { status: 400 })
  }

  const conversationMessages = messages.filter(
    msg => msg.conversationId === conversationId
  )

  return NextResponse.json(conversationMessages)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const data = await request.json()
  const newMessage = {
    id: String(messages.length + 1),
    conversationId: data.conversationId,
    senderId: session.user.id,
    content: data.content,
    createdAt: new Date().toISOString(),
    readAt: null
  }

  messages.push(newMessage)
  return NextResponse.json(newMessage)
}
