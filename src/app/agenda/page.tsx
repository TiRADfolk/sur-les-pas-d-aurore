import { getEvenements } from '@/lib/googleSheets';

export const revalidate = 60;

export default async function AgendaPage() {
  const evenements = await getEvenements();

  // Date du jour au format YYYY-MM-DD à minuit
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fonction pour vérifier si une date est passée
  const estPasse = (dateStr: string) => {
    if (!dateStr) return false;
    const dateEvt = new Date(dateStr);
    dateEvt.setHours(0, 0, 0, 0);
    return dateEvt < today;
  };

  // Filtrage automatique basé sur la date du jour
  const aVenir = evenements
    .filter(e => !estPasse(e.date))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const passes = evenements
    .filter(e => estPasse(e.date))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
          <div className="space-y-4">
            {aVenir.map((evt) => (
              <div key={evt.id} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-md">
                      {evt.date} {evt.heure && `à ${evt.heure}`}
                    </span>
                    <span className="text-sm text-stone-500 font-medium">{evt.ville}</span>
                    
                    {/* Badge "Gratuit" si indiqué dans la colonne statut */}
                    {evt.statut && evt.statut.toLowerCase().includes('gratuit') && (
                      <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        🎁 Gratuit
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mt-1">{evt.titre}</h3>
                  <p className="text-stone-600 text-sm">{evt.lieu}</p>
                  {evt.description && <p className="text-stone-500 text-xs mt-2">{evt.description}</p>}
                </div>

                {evt.lienBilletterie && (
                  <a 
                    href={evt.lienBilletterie} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl text-center transition"
                  >
                    Réserver / Billetterie
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CONCERTS PASSÉS */}
      {passes.length > 0 && (
        <section className="space-y-6 pt-6">
          <h2 className="text-xl font-bold text-stone-800 border-b border-stone-200 pb-3">Oh dommage c'est passé</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-80">
            {passes.map((evt) => (
              <div key={evt.id} className="bg-stone-100 rounded-xl p-4 border border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-stone-500">{evt.date} - {evt.ville}</span>
                  {evt.statut && evt.statut.toLowerCase().includes('gratuit') && (
                    <span className="text-[10px] font-medium bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded">
                      Gratuit
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-stone-800 mt-0.5">{evt.titre}</h3>
                <p className="text-xs text-stone-600">{evt.lieu}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
