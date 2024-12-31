import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Building2, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Trouvez votre prochain chez-vous
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Des milliers de biens à louer partout au Burkina Faso
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-4 p-4 bg-white/10 backdrop-blur-md rounded-lg">
              <Input
                type="text"
                placeholder="Ville, code postal ou adresse"
                className="flex-1"
              />
              <Button size="lg">
                <Search className="mr-2 h-4 w-4" />
                Rechercher
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pourquoi choisir ImmoConnect ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border bg-card text-card-foreground"
              >
                <feature.icon className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Vous êtes propriétaire ?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Publiez votre annonce gratuitement et trouvez rapidement le locataire idéal pour votre bien
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/post-property">
              Mettre mon bien en location
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    title: "Recherche simplifiée",
    description: "Trouvez facilement le bien qui vous correspond grâce à nos filtres de recherche avancés",
    icon: Search,
  },
  {
    title: "Gestion des biens",
    description: "Gérez vos biens immobiliers en toute simplicité",
    icon: Building2,
  },
  {
    title: "Contact direct",
    description: "Contactez directement les propriétaires par appel ou SMS via notre plateforme sécurisée, que vous soyez à Ouagadougou, Bobo-Dioulasso ou ailleurs au Faso",
    icon: MessageCircle,
  },
]