import { getEvenements } from '@/lib/googleSheets';

export const revalidate = 60;

export default async function AgendaPage() {
  const evenements = await getEvenements();

  // Date du jour (minuit)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Helper pour convertir une string de date de type YYYY-MM-DD en objet Date
  const parseEvtDate = (dateStr: string) => {
    if (!dateStr) return new Date(0);
    // Gestion du format YYYY-MM-DD
    const parts = dateStr.trim().split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
    return new Date(dateStr);
  };

  // Séparation automatique des dates
  const aVenir = evenements
    .filter(e => {
      const d = parseEvtDate(e.date);
      d.setHours(0, 0, 0, 0);
      return d >= today;
    })
    .sort((a, b) => parseEvtDate(a.date).getTime() - parseEvtDate(b.date).getTime());

  const passes = evenements
    .filter(e => {
      const d = parseEvtDate(e.date);
      d.setHours(0, 0, 0, 0);
      return d < today;
    })
    .sort((a, b) => parseEvtDate(b.date).getTime() - parseEvtDate(a.date).getTime());

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
                {/* A) PHOTO SUR LA GAUCHE */}
                {evt.photoUrl && evt.photoUrl.trim() !== '' ? (
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

                {/* CONTENU DU CADRE (3 LIGNES + BOUTON) */}
                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    {/* 1ère ligne : Date, Heure, Ville, Gratuit */}
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

                    {/* 2ème ligne : Titre */}
                    <h3 className="text-2xl font-bold text-stone-900 pt-1">
                      {evt.titre}
                    </h3>

                    {/* 3ème ligne : Description */}
                    {evt.description && (
                      <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line pt-1">
                        {evt.description}
                      </p>
                    )}
                  </div>

                  {/* BOUTON LIEN CLIQUABLE */}
                  {evt.lienBilletterie && (
                    <div className="pt-2">
                      <a 
                        href={evt.lienBilletterie} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition shadow-sm"
                      >
                        🔗 Accéder au lien / Billetterie
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
                {evt.photoUrl && (
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
