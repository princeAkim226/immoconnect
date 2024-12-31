import './globals.css';
import 'leaflet/dist/leaflet.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SessionProvider } from "@/components/session-provider";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ImmoConnect - Votre plateforme immobilière',
  description: 'Trouvez votre prochain chez-vous ou mettez en location vos biens immobiliers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1 container mx-auto px-4 md:px-6 max-w-7xl">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </Providers>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}