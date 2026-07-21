import { getInfoSite } from '@/lib/googleSheets';

export const revalidate = 60;

export default async function ContactPage() {
  const info = await getInfoSite();

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-stone-900">Contact</h1>
        <p className="text-stone-600">Une question, un projet de bal ou d'animation Folk/Trad ? Écrivez-nous !</p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl">
            <span className="text-2xl">📧</span>
            <div>
              <p className="text-xs text-stone-400 font-bold uppercase">Adresse Email</p>
              <a href={`mailto:${info.email || 'contact@surlespasdaurore.fr'}`} className="font-bold text-stone-800 hover:text-amber-700">
                {info.email || 'contact@surlespasdaurore.fr'}
              </a>
            </div>
          </div>

          {info.telephone && (
            <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl">
              <span className="text-2xl">📞</span>
              <div>
                <p className="text-xs text-stone-400 font-bold uppercase">Téléphone</p>
                <a href={`tel:${info.telephone}`} className="font-bold text-stone-800 hover:text-amber-700">
                  {info.telephone}
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-stone-100 pt-6">
          <h2 className="font-bold text-stone-800 mb-2">N'hésitez pas à nous contacter</h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            Pour réserver votre bal privé ou public, contactez-nous directement par email.
          </p>
        </div>
      </div>
    </div>
  );
}
