export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt: string
  readAt: string | null
}

export interface Conversation {
  id: string
  propertyId: string | null
  createdAt: string
  updatedAt: string
  participants: ConversationParticipant[]
  lastMessage?: Message
  property?: {
    id: string
    title: string
    images: string[]
  }
}

export interface ConversationParticipant {
  userId: string
  conversationId: string
  lastReadAt: string
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
}
