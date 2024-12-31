'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { MessageCircle } from 'lucide-react'
import { Property } from '@/types/property'
import { useConversations } from '@/hooks/use-conversations'

interface ContactButtonProps {
  property: Property
  ownerId: string
}

export function ContactButton({ property, ownerId }: ContactButtonProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const { createConversation } = useConversations()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  async function handleContact() {
    if (!session) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour contacter le propriétaire",
        variant: "destructive"
      })
      router.push('/login')
      return
    }

    if (session.user.id === ownerId) {
      toast({
        title: "Action impossible",
        description: "Vous ne pouvez pas vous contacter vous-même",
        variant: "destructive"
      })
      return
    }

    try {
      setIsLoading(true)
      const conversation = await createConversation(
        property.id,
        [ownerId],
        `Bonjour, je suis intéressé par votre bien "${property.title}"`
      )
      router.push('/messages')
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la conversation",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleContact}
      disabled={isLoading}
      className="w-full"
    >
      <MessageCircle className="mr-2 h-4 w-4" />
      Contacter le propriétaire
    </Button>
  )
}
