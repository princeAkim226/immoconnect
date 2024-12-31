'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Conversation, Message } from '@/types/message'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConversationWindowProps {
  conversation: Conversation
  messages: Message[]
  onSendMessage: (content: string) => Promise<void>
}

export function ConversationWindow({
  conversation,
  messages,
  onSendMessage
}: ConversationWindowProps) {
  const { data: session } = useSession()
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Faire défiler jusqu'au dernier message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    try {
      setIsSending(true)
      await onSendMessage(newMessage)
      setNewMessage('')
    } finally {
      setIsSending(false)
    }
  }

  function getOtherParticipant() {
    return conversation.participants.find(
      p => p.userId !== session?.user?.id
    )?.user
  }

  const otherUser = getOtherParticipant()

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* En-tête */}
      <div className="flex items-center gap-3 p-4 border-b">
        <Avatar className="h-10 w-10">
          <AvatarImage src={otherUser?.image || undefined} />
          <AvatarFallback>
            {otherUser?.name?.[0] || otherUser?.email?.[0] || '?'}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">
            {otherUser?.name || otherUser?.email || 'Utilisateur inconnu'}
          </p>
          {conversation.property && (
            <p className="text-sm text-muted-foreground">
              {conversation.property.title}
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const isOwnMessage = message.senderId === session?.user?.id

            return (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  isOwnMessage ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-lg p-3",
                    isOwnMessage
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {format(new Date(message.createdAt), 'PP à p', { locale: fr })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>

      {/* Formulaire d'envoi */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            disabled={isSending}
          />
          <Button type="submit" size="icon" disabled={isSending}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
