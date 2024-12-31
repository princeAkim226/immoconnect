import { Building2 } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t bg-gradient-to-b from-background to-background/95 mt-auto">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">ImmoConnect</span>
            </Link>
            <p className="text-base text-muted-foreground/90 leading-relaxed">
              Votre plateforme de confiance pour trouver ou mettre en location des biens immobiliers.
            </p>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Navigation</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/properties" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center space-x-2">
                  <span>→</span>
                  <span>Rechercher</span>
                </Link>
              </li>
              <li>
                <Link href="/post-property" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center space-x-2">
                  <span>→</span>
                  <span>Mettre en location</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center space-x-2">
                  <span>→</span>
                  <span>À propos</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center space-x-2">
                  <span>→</span>
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Légal</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center space-x-2">
                  <span>→</span>
                  <span>Conditions d'utilisation</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center space-x-2">
                  <span>→</span>
                  <span>Politique de confidentialité</span>
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center space-x-2">
                  <span>→</span>
                  <span>Politique des cookies</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Contact</h3>
            <ul className="space-y-4">
              <li className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center space-x-3">
                <span className="text-primary">📧</span>
                <span>contact@immoconnect.fr</span>
              </li>
              <li className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center space-x-3">
                <span className="text-primary">📱</span>
                <span>+226 77 00 00 00</span>
              </li>
              <li className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center space-x-3">
                <span className="text-primary">📍</span>
                <span>123 rue de la Paix, Bobo</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-primary/10 text-center text-muted-foreground/80">
          <p>&copy; {new Date().getFullYear()} ImmoConnect. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}