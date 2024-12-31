'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Conversation } from '@/types/message'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface ConversationListProps {
  conversations: Conversation[]
  selectedId?: string
  onSelect: (conversation: Conversation) => void
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect
}: ConversationListProps) {
  const { data: session } = useSession()

  function getOtherParticipant(conversation: Conversation) {
    return conversation.participants.find(
      p => p.userId !== session?.user?.id
    )?.user
  }

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-2 p-2">
        {conversations.map(conversation => {
          const otherUser = getOtherParticipant(conversation)
          const isSelected = selectedId === conversation.id
          const hasUnread = conversation.lastMessage && 
            conversation.lastMessage.senderId !== session?.user?.id &&
            !conversation.lastMessage.readAt

          return (
            <button
              key={conversation.id}
              className={cn(
                "w-full text-left p-3 rounded-lg transition-colors",
                "hover:bg-muted/50",
                isSelected && "bg-muted",
                hasUnread && "font-medium"
              )}
              onClick={() => onSelect(conversation)}
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={otherUser?.image || undefined} />
                  <AvatarFallback>
                    {otherUser?.name?.[0] || otherUser?.email?.[0] || '?'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className="truncate">
                      {otherUser?.name || otherUser?.email || 'Utilisateur inconnu'}
                    </p>
                    {conversation.lastMessage && (
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(conversation.lastMessage.createdAt), 'PP', { locale: fr })}
                      </span>
                    )}
                  </div>

                  {conversation.property && (
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.property.title}
                    </p>
                  )}

                  {conversation.lastMessage && (
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage.senderId === session?.user?.id ? 'Vous : ' : ''}
                      {conversation.lastMessage.content}
                    </p>
                  )}
                </div>
              </div>
            </button>
          )
        })}

        {conversations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Aucune conversation
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
