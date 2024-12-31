import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

const conversations = [
  {
    id: '1',
    participants: ['1', '2'],
    lastMessage: 'Bonjour, je suis intéressé par votre bien',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const userConversations = conversations.filter(conv => 
    conv.participants.includes(session.user.id)
  )

  return NextResponse.json(userConversations)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const data = await request.json()
  const newConversation = {
    id: String(conversations.length + 1),
    participants: [session.user.id, data.recipientId],
    lastMessage: data.message || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  conversations.push(newConversation)
  return NextResponse.json(newConversation)
}
