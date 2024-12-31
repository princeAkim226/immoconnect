'use client'

import { useState, useEffect } from 'react'
import { Conversation, Message } from '@/types/message'
import { useSession } from 'next-auth/react'

interface UseConversationsOptions {
  onError?: (error: Error) => void
}

export function useConversations(options: UseConversationsOptions = {}) {
  const { data: session } = useSession()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (session) {
      loadConversations()
    }
  }, [session])

  async function loadConversations() {
    try {
      const response = await fetch('/api/conversations')
      if (!response.ok) throw new Error('Erreur lors du chargement des conversations')
      const data = await response.json()
      setConversations(data)
    } catch (err: any) {
      setError(err)
      options.onError?.(err)
    } finally {
      setIsLoading(false)
    }
  }

  async function createConversation(propertyId: string, participantIds: string[], message?: string) {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId, participantIds, message })
      })

      if (!response.ok) throw new Error('Erreur lors de la création de la conversation')
      
      const data = await response.json()
      setConversations(prev => [data, ...prev])
      return data
    } catch (err: any) {
      setError(err)
      options.onError?.(err)
      throw err
    }
  }

  async function sendMessage(conversationId: string, content: string) {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, content })
      })

      if (!response.ok) throw new Error('Erreur lors de l\'envoi du message')
      
      const message = await response.json()
      
      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: message,
            updatedAt: new Date().toISOString()
          }
        }
        return conv
      }))

      return message
    } catch (err: any) {
      setError(err)
      options.onError?.(err)
      throw err
    }
  }

  async function getMessages(conversationId: string) {
    try {
      const response = await fetch(`/api/messages?conversationId=${conversationId}`)
      if (!response.ok) throw new Error('Erreur lors du chargement des messages')
      return await response.json()
    } catch (err: any) {
      setError(err)
      options.onError?.(err)
      throw err
    }
  }

  return {
    conversations,
    isLoading,
    error,
    createConversation,
    sendMessage,
    getMessages,
    refresh: loadConversations
  }
}
