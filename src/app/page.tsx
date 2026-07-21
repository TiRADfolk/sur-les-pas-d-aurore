import { getInfoSite, getEvenements, getActivites } from '@/lib/googleSheets';
import Link from 'next/link';

export const revalidate = 60;

export default async function HomePage() {
  const info = await getInfoSite();
  const evenements = await getEvenements();
  const activites = await getActivites();

  const prochainsConcerts = evenements
    .filter(e => e.statut === 'A venir')
    .slice(0, 3);

  return (
    <div className="space-y-16">
      {/* HERO SECTION */}
      <section className="relative rounded-3xl overflow-hidden bg-stone-900 text-white min-h-[400px] flex items-center justify-center p-8 text-center shadow-xl">
        {info.hero_image && (
          <img 
            src={info.hero_image} 
            alt="Hero Sur les pas d'Aurore" 
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        )}
        <div className="relative z-10 max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-amber-400">
            {info.nom_groupe || "Sur les pas d'Aurore"}
          </h1>
          <p className="text-lg md:text-xl text-stone-200 leading-relaxed font-light">
            {info.intro_accueil || "Bienvenue dans notre univers musical unique."}
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link href="/agenda" className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg">
              Voir nos dates
            </Link>
            <Link href="/contact" className="bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold py-3 px-6 rounded-xl transition-all border border-stone-600">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      {/* PROCHAINS CONCERTS */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-stone-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">Prochains Concerts</h2>
            <p className="text-stone-500 text-sm">Retrouvez-nous très bientôt sur scène</p>
          </div>
          <Link href="/agenda" className="text-amber-700 hover:underline text-sm font-semibold">
            Tout l'agenda →
          </Link>
        </div>

        {prochainsConcerts.length === 0 ? (
          <p className="text-stone-500 italic py-4">Aucune date à venir pour le moment. Consultez notre agenda régulièrement !</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {prochainsConcerts.map(evt => (
              <div key={evt.id} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                    {evt.date} {evt.heure && `• ${evt.heure}`}
                  </span>
                  <h3 className="text-xl font-bold text-stone-800 mt-3">{evt.titre}</h3>
                  <p className="text-stone-600 text-sm mt-1">{evt.lieu} - {evt.ville}</p>
                </div>
                {evt.lienBilletterie && (
                  <a 
                    href={evt.lienBilletterie} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="mt-4 block text-center bg-stone-900 text-white text-xs font-bold py-2 px-4 rounded-lg hover:bg-stone-800 transition"
                  >
                    Billetterie / Infos
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* APERÇU ACTIVITÉS */}
      {activites.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-stone-900 border-b border-stone-200 pb-4">Ce que nous proposons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activites.slice(0, 2).map(act => (
              <div key={act.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 flex flex-col">
                {act.image && <img src={act.image} alt={act.titre} className="w-full h-48 object-cover" />}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-stone-800">{act.titre}</h3>
                    <p className="text-amber-700 text-sm font-medium">{act.sousTitre}</p>
                    <p className="text-stone-600 text-sm mt-2 line-clamp-3">{act.description}</p>
                  </div>
                  <Link href="/activites" className="text-amber-700 font-semibold text-sm hover:underline">
                    Détails des prestations →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
