import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabase } from '@/lib/supabase'
import { authOptions } from '../auth/[...nextauth]/route'

// Récupérer les messages d'une conversation
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get('conversationId')

  if (!conversationId) {
    return NextResponse.json({ error: 'ID de conversation manquant' }, { status: 400 })
  }

  // Vérifier que l'utilisateur est participant à la conversation
  const { data: participant } = await supabase
    .from('conversation_participants')
    .select('*')
    .eq('conversation_id', conversationId)
    .eq('user_id', session.user.id)
    .single()

  if (!participant) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  // Récupérer les messages
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Marquer les messages comme lus
  await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .neq('sender_id', session.user.id)
    .is('read_at', null)

  return NextResponse.json(messages)
}

// Envoyer un message
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const json = await request.json()
    const { conversationId, content } = json

    if (!conversationId || !content) {
      return NextResponse.json(
        { error: 'ID de conversation et contenu requis' },
        { status: 400 }
      )
    }

    // Vérifier que l'utilisateur est participant à la conversation
    const { data: participant } = await supabase
      .from('conversation_participants')
      .select('*')
      .eq('conversation_id', conversationId)
      .eq('user_id', session.user.id)
      .single()

    if (!participant) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    // Créer le message
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          conversation_id: conversationId,
          sender_id: session.user.id,
          content
        }
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
