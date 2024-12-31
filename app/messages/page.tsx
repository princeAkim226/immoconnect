'use client'

import { useState, useEffect } from 'react'
import { useConversations } from '@/hooks/use-conversations'
import { ConversationList } from '@/components/messages/conversation-list'
import { ConversationWindow } from '@/components/messages/conversation-window'
import { Message } from '@/types/message'
import { useToast } from '@/components/ui/use-toast'

export default function MessagesPage() {
  const { conversations, sendMessage, getMessages } = useConversations()
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const { toast } = useToast()

  // Charger les messages de la conversation sélectionnée
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id)
    }
  }, [selectedConversation])

  async function loadMessages(conversationId: string) {
    try {
      setIsLoadingMessages(true)
      const data = await getMessages(conversationId)
      setMessages(data)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages",
        variant: "destructive"
      })
    } finally {
      setIsLoadingMessages(false)
    }
  }

  async function handleSendMessage(content: string) {
    if (!selectedConversation) return

    try {
      await sendMessage(selectedConversation.id, content)
      await loadMessages(selectedConversation.id)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        <aside>
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversation?.id}
            onSelect={setSelectedConversation}
          />
        </aside>

        <main>
          {selectedConversation ? (
            <ConversationWindow
              conversation={selectedConversation}
              messages={messages}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="h-[calc(100vh-12rem)] flex items-center justify-center text-muted-foreground">
              Sélectionnez une conversation
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
