import { getMedias } from '@/lib/googleSheets';

export const revalidate = 60;

export default async function MediaPage() {
  const medias = await getMedias();

  return (
    <div className="space-y-10">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-3xl font-bold text-stone-900">Galerie & Médias</h1>
        <p className="text-stone-500 text-sm mt-1">Photos, vidéos et extraits audios</p>
      </div>

      {medias.length === 0 ? (
        <p className="text-stone-500 italic">Aucun média disponible pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {medias.map((med) => (
            <div key={med.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 flex flex-col">
              {med.type === 'photo' && med.url && (
                <img src={med.url} alt={med.titre} className="w-full h-48 object-cover" />
              )}
              
              {med.type === 'video' && (
                <div className="w-full h-48 bg-stone-900 flex items-center justify-center p-2">
                  {med.url.includes('youtube') || med.url.includes('youtu.be') ? (
                    <iframe 
                      className="w-full h-full rounded" 
                      src={med.url.replace('watch?v=', 'embed/')} 
                      title={med.titre} 
                      allowFullScreen 
                    />
                  ) : (
                    <a href={med.url} target="_blank" rel="noopener noreferrer" className="text-amber-400 font-bold text-sm underline">
                      ▶ Voir la vidéo
                    </a>
                  )}
                </div>
              )}

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600 px-2.5 py-1 rounded">
                    {med.categorie}
                  </span>
                  <h3 className="font-bold text-stone-800 text-base mt-2">{med.titre}</h3>
                </div>
                {med.date && <p className="text-xs text-stone-400 mt-2">{med.date}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
