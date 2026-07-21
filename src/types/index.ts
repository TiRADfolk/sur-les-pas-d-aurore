export interface Membre {
  id: string;
  nom: string;
  role: string;
  description: string;
  photoUrl: string;
  ordre: number;
  actif: boolean;
}

export interface Evenement {
  id: string;
  titre: string;
  date: string;
  heure: string;
  lieu: string;
  ville: string;
  description: string;
  lienBilletterie: string;
  statut: 'A venir' | 'Passé';
  photoUrl: string;
}

export interface Activite {
  id: string;
  titre: string;
  sousTitre: string;
  description: string;
  tarif: string;
  image: string;
  ordre: number;
}

export interface MediaItem {
  id: string;
  titre: string;
  type: 'photo' | 'video' | 'audio';
  url: string;
  miniature: string;
  categorie: string;
  date: string;
}
