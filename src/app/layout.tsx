import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: "Sur les pas d'Aurore - Site Officiel",
  description: "Bal folk, Animation et initiation aux danses Sur les pas d'Aurore",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
        <header className="bg-stone-900 text-stone-100 sticky top-0 z-50 shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="text-2xl font-bold tracking-wide text-amber-500 hover:text-amber-400">
              Sur les pas d'Aurore
            </Link>
            <nav className="flex flex-wrap gap-6 text-sm font-medium">
              <Link href="/" className="hover:text-amber-400 transition-colors">Accueil</Link>
              <Link href="/presentation" className="hover:text-amber-400 transition-colors">Présentation</Link>
              <Link href="/agenda" className="hover:text-amber-400 transition-colors">Agenda</Link>
              <Link href="/activites" className="hover:text-amber-400 transition-colors">Prestations</Link>
              <Link href="/media" className="hover:text-amber-400 transition-colors">Médias</Link>
              <Link href="/contact" className="hover:text-amber-400 transition-colors">Contact</Link>
            </nav>
          </div>
        </header>

        <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="bg-stone-900 text-stone-400 py-8 border-t border-stone-800 text-center text-sm">
          <div className="max-w-6xl mx-auto px-4">
            <p>© {new Date().getFullYear()} Sur les pas d'Aurore. Tous droits réservés.</p>
            <p className="text-xs text-stone-500 mt-2">Contact</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
