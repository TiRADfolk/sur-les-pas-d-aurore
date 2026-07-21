import { Membre, Evenement, Activite, MediaItem } from '@/types';

export function getDriveImageUrl(url: string | undefined): string {
  if (!url || url.trim() === '' || url === '...') return '';
  const cleanUrl = url.trim();
  if (!cleanUrl.includes('drive.google.com')) return cleanUrl;

  let fileId = '';
  const matchFileD = cleanUrl.match(/\/file\/d\/([^\/\?]+)/);
  if (matchFileD && matchFileD[1]) {
    fileId = matchFileD[1];
  } else {
    const matchId = cleanUrl.match(/id=([^&]+)/);
    if (matchId && matchId[1]) fileId = matchId[1];
  }

  return fileId ? `https://lh3.googleusercontent.com/d/${fileId}` : cleanUrl;
}

function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const result: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values: string[] = [];
    let insideQuote = false;
    let currentValue = '';

    for (let charIndex = 0; charIndex < line.length; charIndex++) {
      const char = line[charIndex];
      if (char === '"' || char === "'") {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        values.push(currentValue.trim().replace(/^"|"$/g, ''));
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim().replace(/^"|"$/g, ''));

    const rowObj: Record<string, string> = {};
    headers.forEach((header, idx) => {
      rowObj[header] = values[idx] || '';
    });
    result.push(rowObj);
  }
  return result;
}

const DEFAULT_SHEET_ID = "1jqSiovwMa_hISxoNORvt9OIljvQ21GP8";

async function fetchSheetTabCSV(tabName: string): Promise<Record<string, string>[]> {
  const sheetId = process.env.NEXT_PUBLIC_SPREADSHEET_ID || DEFAULT_SHEET_ID;
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const text = await res.text();
    return parseCSV(text);
  } catch (error) {
    return [];
  }
}

export async function getInfoSite(): Promise<Record<string, string>> {
  const data = await fetchSheetTabCSV('InfoSite');
  const infoMap: Record<string, string> = {};
  data.forEach(row => { if (row.cle) infoMap[row.cle] = row.valeur || ''; });
  return infoMap;
}

export async function getMembres(): Promise<Membre[]> {
  const data = await fetchSheetTabCSV('Membres');
  return data
    .filter(row => row.actif !== 'NON')
    .map(row => ({
      id: row.id || Math.random().toString(),
      nom: row.nom || 'Membre',
      role: row.role || 'Musicien',
      description: row.description || '',
      photoUrl: getDriveImageUrl(row.photoUrl),
      ordre: parseInt(row.ordre || '999', 10),
      actif: row.actif !== 'NON'
    }))
    .sort((a, b) => a.ordre - b.ordre);
}

export async function getEvenements(): Promise<Evenement[]> {
  const data = await fetchSheetTabCSV('Evenements');
  return data.map(row => ({
    id: row.id || Math.random().toString(),
    titre: row.titre || 'Concert',
    date: row.date || '',
    heure: row.heure || '',
    lieu: row.lieu || '',
    ville: row.ville || '',
    description: row.description || '',
    lienBilletterie: row.lienBilletterie || '',
    statut: (row.statut === 'Passé' ? 'Passé' : 'A venir') as 'A venir' | 'Passé',
    photoUrl: getDriveImageUrl(row.photoUrl)
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getActivites(): Promise<Activite[]> {
  const data = await fetchSheetTabCSV('Activites');
  return data.map(row => ({
    id: row.id || Math.random().toString(),
    titre: row.titre || 'Prestation',
    sousTitre: row.sousTitre || '',
    description: row.description || '',
    tarif: row.tarif || '',
    image: getDriveImageUrl(row.image),
    ordre: parseInt(row.ordre || '999', 10)
  })).sort((a, b) => a.ordre - b.ordre);
}

export async function getMedias(): Promise<MediaItem[]> {
  const data = await fetchSheetTabCSV('Medias');
  return data.map(row => ({
    id: row.id || Math.random().toString(),
    titre: row.titre || 'Média',
    type: (row.type as 'photo' | 'video' | 'audio') || 'photo',
    url: row.type === 'photo' ? getDriveImageUrl(row.url) : row.url,
    miniature: getDriveImageUrl(row.miniature),
    categorie: row.categorie || 'Général',
    date: row.date || ''
  }));
}
