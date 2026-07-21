import { getInfoSite, getMembres } from '@/lib/googleSheets';

export const revalidate = 60;

export default async function PresentationPage() {
  const info = await getInfoSite();
  const membres = await getMembres();

  return (
    <div className="space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900">À propos du groupe</h1>
        <p className="text-stone-600 leading-relaxed text-lg">
          {info.histoire_groupe || "Découvrez l'histoire et les musiciens qui composent Sur les pas d'Aurore."}
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-stone-900 border-b border-stone-200 pb-3">Les Membres</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {membres.map((membre) => (
            <div key={membre.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden flex flex-col justify-between">
              <div>
                {membre.photoUrl && membre.photoUrl.trim() !== "" ? (
                  <img 
                    src={membre.photoUrl} 
                    alt={membre.nom} 
                    className="w-full h-56 object-cover"
                  />
                ) : (
                  <div className="w-full h-56 bg-stone-100 flex items-center justify-center text-4xl text-stone-400">
                    🎵
                  </div>
                )}
                <div className="p-6 text-center">
                  <h3 className="font-bold text-xl text-stone-800">{membre.nom}</h3>
                  <p className="text-amber-700 text-xs font-semibold uppercase tracking-wider mb-3">{membre.role}</p>
                  {membre.description && (
                    <p className="text-stone-600 text-sm leading-relaxed">{membre.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
