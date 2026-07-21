import { getActivites } from '@/lib/googleSheets';

export const revalidate = 60;

export default async function ActivitesPage() {
  const activites = await getActivites();

  return (
    <div className="space-y-10">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-3xl font-bold text-stone-900">Nos Prestations & Formules</h1>
        <p className="text-stone-500 text-sm mt-1">Festival, concert privé, événementiel ou animations sur-mesure</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {activites.map((act) => (
          <div key={act.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 flex flex-col justify-between">
            <div>
              {act.image && (
                <img src={act.image} alt={act.titre} className="w-full h-56 object-cover" />
              )}
              <div className="p-6 space-y-3">
                <h2 className="text-2xl font-bold text-stone-800">{act.titre}</h2>
                {act.sousTitre && <p className="text-amber-700 font-semibold text-sm">{act.sousTitre}</p>}
                <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">{act.description}</p>
              </div>
            </div>
            {act.tarif && (
              <div className="p-6 pt-0 border-t border-stone-50 mt-4">
                <span className="text-xs text-stone-400 uppercase font-bold">Tarif indicatif :</span>
                <p className="text-stone-800 font-bold text-sm">{act.tarif}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
