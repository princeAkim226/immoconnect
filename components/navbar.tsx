"use client"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Building2, Home, LogIn, Menu, UserPlus } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
          <Building2 className="h-7 w-7 text-primary" />
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">ImmoConnect</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/properties" className="text-base font-medium text-foreground/70 hover:text-primary transition-colors">
            Rechercher
          </Link>
          <Link href="/post-property" className="text-base font-medium text-foreground/70 hover:text-primary transition-colors">
            Mettre en location
          </Link>
          <Link href="/about" className="text-base font-medium text-foreground/70 hover:text-primary transition-colors">
            À propos
          </Link>
          <Link href="/contact" className="text-base font-medium text-foreground/70 hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <ModeToggle />
          <div className="hidden md:flex space-x-3">
            <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary" asChild>
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Connexion
              </Link>
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all" asChild>
              <Link href="/register">
                <UserPlus className="mr-2 h-4 w-4" />
                Inscription
              </Link>
            </Button>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/properties">Rechercher</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/post-property">Mettre en location</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/about">À propos</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/contact">Contact</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/login">Connexion</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/register">Inscription</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}