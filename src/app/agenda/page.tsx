import { getEvenements } from '@/lib/googleSheets';

export const revalidate = 60;

export default async function AgendaPage() {
  const rawEvenements = await getEvenements();

  // Date du jour (minuit)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Convertisseur universel de date (gère YYYY-MM-DD et DD/MM/YYYY)
  const parseEvtDate = (dateStr: string): Date | null => {
    if (!dateStr || dateStr.trim() === '' || dateStr === '...') return null;
    const cleanStr = dateStr.trim();

    // Format FR : DD/MM/YYYY ou DD-MM-YYYY
    if (cleanStr.includes('/')) {
      const parts = cleanStr.split('/');
      if (parts.length === 3) {
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      }
    }

    // Format ISO : YYYY-MM-DD
    if (cleanStr.includes('-')) {
      const parts = cleanStr.split('-');
      if (parts.length === 3 && parts[0].length === 4) {
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      }
      if (parts.length === 3 && parts[2].length === 4) { // DD-MM-YYYY
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      }
    }

    const d = new Date(cleanStr);
    return isNaN(d.getTime()) ? null : d;
  };

  // 1. Filtrer les événements valides
  const evenementsValides = rawEvenements.filter(e => 
    e.titre && e.titre.trim() !== '' && e.titre !== 'Concert' && e.date && e.date.trim() !== ''
  );

  // 2. DATES À VENIR : De la plus proche (récente) à la plus éloignée dans le futur
  const aVenir = evenementsValides
    .filter(e => {
      const d = parseEvtDate(e.date);
      if (!d) return true; // Par défaut si date illisible, on garde en "A venir"
      d.setHours(0, 0, 0, 0);
      return d >= today;
    })
    .sort((a, b) => {
      const dA = parseEvtDate(a.date)?.getTime() || 0;
      const dB = parseEvtDate(b.date)?.getTime() || 0;
      return dA - dB; // Ordre chronologique croissant (futur proche -> futur lointain)
    });

  // 3. DATES PASSÉES : De la plus récente (hier) à la plus vieille (il y a longtemps)
  const passes = evenementsValides
    .filter(e => {
      const d = parseEvtDate(e.date);
      if (!d) return false;
      d.setHours(0, 0, 0, 0);
      return d < today;
    })
    .sort((a, b) => {
      const dA = parseEvtDate(a.date)?.getTime() || 0;
      const dB = parseEvtDate(b.date)?.getTime() || 0;
      return dB - dA; // Ordre anti-chronologique décroissant (passé récent -> passé ancien)
    });

  return (
    <div className="space-y-12">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-3xl font-bold text-stone-900">Agenda & Bals</h1>
        <p className="text-stone-500 text-sm mt-1">Découvrez où et quand venir nous voir live et danser</p>
      </div>

      {/* DATES À VENIR */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
          Prochaines dates
        </h2>

        {aVenir.length === 0 ? (
          <p className="text-stone-500 italic bg-white p-6 rounded-2xl border border-stone-100">
            Aucun concert programmé actuellement. Revenez très vite !
          </p>
        ) : (
          <div className="space-y-6">
            {aVenir.map((evt) => (
              <div 
                key={evt.id} 
                className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden flex flex-col md:flex-row items-stretch hover:shadow-md transition-shadow"
              >
                {/* PHOTO SUR LA GAUCHE */}
                {evt.photoUrl && evt.photoUrl.trim() !== '' && evt.photoUrl !== '...' ? (
                  <div className="md:w-56 h-48 md:h-auto flex-shrink-0 relative bg-stone-100">
                    <img 
                      src={evt.photoUrl} 
                      alt={evt.titre} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="md:w-48 h-32 md:h-auto flex-shrink-0 bg-stone-100 flex items-center justify-center text-stone-400 text-3xl">
                    🎵
                  </div>
                )}

                {/* CONTENU DU CADRE */}
                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    {/* Ligne 1 : Date, Ville, Gratuit */}
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
                        🗓️ {evt.date} {evt.heure && `à ${evt.heure}`}
                      </span>
                      {evt.ville && (
                        <span className="font-semibold text-stone-700 bg-stone-100 px-3 py-1 rounded-md">
                          📍 {evt.ville} {evt.lieu && `(${evt.lieu})`}
                        </span>
                      )}
                      {evt.statut && evt.statut.toLowerCase().includes('gratuit') && (
                        <span className="font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-md border border-emerald-300">
                          🎁 Gratuit
                        </span>
                      )}
                    </div>

                    {/* Ligne 2 : Titre */}
                    <h3 className="text-2xl font-bold text-stone-900 pt-1">
                      {evt.titre}
                    </h3>

                    {/* Ligne 3 : Description */}
                    {evt.description && evt.description !== '...' && (
                      <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line pt-1">
                        {evt.description}
                      </p>
                    )}
                  </div>

                  {/* BOUTON LIEN CLIQUABLE */}
                  {evt.lienBilletterie && evt.lienBilletterie.trim() !== '' && evt.lienBilletterie !== '...' && (
                    <div className="pt-2">
                      <a 
                        href={evt.lienBilletterie} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition shadow-sm"
                      >
                        🔗 Plus d'information
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CONCERTS PASSÉS */}
      {passes.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-stone-200">
          <h2 className="text-xl font-bold text-stone-800">Oh dommage c'est passé</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75">
            {passes.map((evt) => (
              <div key={evt.id} className="bg-stone-100 rounded-xl p-4 border border-stone-200 flex gap-4 items-center">
                {evt.photoUrl && evt.photoUrl.trim() !== '' && evt.photoUrl !== '...' && (
                  <img src={evt.photoUrl} alt={evt.titre} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                )}
                <div>
                  <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                    <span>{evt.date}</span>
                    {evt.ville && <span>• {evt.ville}</span>}
                  </div>
                  <h3 className="font-bold text-stone-800 text-base">{evt.titre}</h3>
                  {evt.lieu && <p className="text-xs text-stone-600">{evt.lieu}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
