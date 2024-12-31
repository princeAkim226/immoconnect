import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabase } from '@/lib/supabase'
import { authOptions } from '../auth/[...nextauth]/route'

// Récupérer les conversations de l'utilisateur
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  // Récupérer les conversations avec les derniers messages et les participants
  const { data: conversations, error } = await supabase
    .from('conversations')
    .select(`
      *,
      conversation_participants!inner (
        user_id,
        last_read_at,
        user:users (
          id,
          name,
          email,
          image
        )
      ),
      property:properties (
        id,
        title,
        images
      ),
      messages:messages (
        id,
        content,
        sender_id,
        created_at,
        read_at
      )
    `)
    .eq('conversation_participants.user_id', session.user.id)
    .order('updated_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Formater les conversations
  const formattedConversations = conversations.map(conversation => {
    const messages = conversation.messages || []
    const lastMessage = messages.length > 0 ? messages[0] : null
    
    return {
      ...conversation,
      lastMessage,
      messages: undefined // Ne pas renvoyer tous les messages
    }
  })

  return NextResponse.json(formattedConversations)
}

// Créer une nouvelle conversation
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const json = await request.json()
    const { propertyId, participantIds, message } = json

    if (!participantIds || participantIds.length === 0) {
      return NextResponse.json(
        { error: 'Au moins un participant est requis' },
        { status: 400 }
      )
    }

    // Créer la conversation
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .insert([{ property_id: propertyId }])
      .select()
      .single()

    if (conversationError) throw conversationError

    // Ajouter les participants
    const participants = [
      session.user.id,
      ...participantIds.filter((id: string) => id !== session.user.id)
    ]

    const participantsData = participants.map(userId => ({
      conversation_id: conversation.id,
      user_id: userId
    }))

    const { error: participantsError } = await supabase
      .from('conversation_participants')
      .insert(participantsData)

    if (participantsError) throw participantsError

    // Créer le premier message si fourni
    if (message) {
      const { error: messageError } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversation.id,
          sender_id: session.user.id,
          content: message
        }])

      if (messageError) throw messageError
    }

    return NextResponse.json(conversation)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
