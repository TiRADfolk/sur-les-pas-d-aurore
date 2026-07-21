import { getEvenements } from '@/lib/googleSheets';

export const revalidate = 60;

export default async function AgendaPage() {
  const evenements = await getEvenements();

  const aVenir = evenements.filter(e => e.statut === 'A venir');
  const passes = evenements.filter(e => e.statut === 'Passé');

  return (
    <div className="space-y-12">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-3xl font-bold text-stone-900">Agenda & Concerts</h1>
        <p className="text-stone-500 text-sm mt-1">Découvrez où et quand venir nous écouter live</p>
      </div>

      {/* CONCERTS À VENIR */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
          Concerts à venir
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
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-md">
                      {evt.date} {evt.heure && `à ${evt.heure}`}
                    </span>
                    <span className="text-sm text-stone-500 font-medium">{evt.ville}</span>
                  </div>
                  <h3 className="text-xl font-bold text-stone-900">{evt.titre}</h3>
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
          <h2 className="text-xl font-bold text-stone-800 border-b border-stone-200 pb-3">Concerts passés</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-80">
            {passes.map((evt) => (
              <div key={evt.id} className="bg-stone-100 rounded-xl p-4 border border-stone-200">
                <span className="text-xs font-semibold text-stone-500">{evt.date} - {evt.ville}</span>
                <h3 className="font-bold text-stone-800">{evt.titre}</h3>
                <p className="text-xs text-stone-600">{evt.lieu}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
