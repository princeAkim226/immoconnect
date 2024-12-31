'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const name = formData.get('name') as string
      const email = formData.get('email') as string
      const password = formData.get('password') as string
      const confirmPassword = formData.get('confirmPassword') as string

      if (password !== confirmPassword) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Les mots de passe ne correspondent pas',
        })
        return
      }

      // Simulate registration success
      toast({
        title: 'Compte créé avec succès',
        description: 'Vous pouvez maintenant vous connecter',
      })
      router.push('/login')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la création du compte',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Créer un compte
          </h1>
          <p className="text-sm text-muted-foreground">
            Entrez vos informations ci-dessous pour créer votre compte
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Input
              name="name"
              placeholder="Nom"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Input
              name="password"
              type="password"
              placeholder="Mot de passe"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirmer le mot de passe"
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Création en cours...' : 'Créer un compte'}
          </Button>
        </form>
        <p className="px-8 text-center text-sm text-muted-foreground">
          Vous avez déjà un compte?{' '}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
