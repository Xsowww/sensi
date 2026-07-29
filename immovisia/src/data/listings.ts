export type Deal = 'vente' | 'location';

export interface Listing {
  id: string;
  deal: Deal;
  kind: 'Maison' | 'Appartement';
  title: string;
  /** District or town, also used as the map label. */
  place: string;
  /** One or two lines shown in the listing row. */
  summary: string;
  /** Longer copy, detail page only. */
  description: string[];
  /** Shown as pills. Surface first, then rooms, then the notable extras. */
  features: string[];
  /** Formatted, already carrying the unit. */
  price: string;
  /** Extra rows on the detail page. */
  facts: { label: string; value: string }[];
  photo: { seed: string; alt: string };
  /** Additional shots for the detail page. */
  gallery: { seed: string; alt: string }[];
  coords: { lat: number; lng: number };
}

const photo = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

/** Main photo for a listing row, 4:3. */
export const mainPhotoUrl = (seed: string) => photo(seed, 960, 720);
/** Detail page hero, 16:9. */
export const heroPhotoUrl = (seed: string) => photo(seed, 1600, 900);
/** Detail page thumbnail, 4:3. */
export const thumbPhotoUrl = (seed: string) => photo(seed, 800, 600);

/* Sample inventory. Replace with the agency's real listings, photography and
   surveyed coordinates before going live. */
export const listings: Listing[] = [
  {
    id: 'trespoey',
    deal: 'vente',
    kind: 'Maison',
    title: 'Contemporaine sur parc clos',
    place: 'Trespoëy, Pau',
    summary:
      'Volumes traversants sur un parc clos de 1 800 m², à dix minutes du centre.',
    description: [
      'Construction de 2016 sur un terrain clos et arboré, orientée plein sud. Le séjour de 62 m² ouvre de plain-pied sur la terrasse et la piscine.',
      'Quatre chambres à l’étage dont une suite parentale avec dressing. Garage double, cave et local technique en sous-sol.',
    ],
    features: ['214 m²', '6 pièces', '4 chambres', 'Piscine', 'Garage double', 'Terrain 1 800 m²'],
    price: '742 000 €',
    facts: [
      { label: 'Année de construction', value: '2016' },
      { label: 'Chauffage', value: 'Pompe à chaleur' },
      { label: 'DPE', value: 'B' },
      { label: 'Taxe foncière', value: '2 140 € par an' },
    ],
    photo: { seed: 'immovisia-maison-trespoey', alt: 'Maison contemporaine avec terrasse, quartier Trespoëy à Pau' },
    gallery: [
      { seed: 'immovisia-trespoey-sejour', alt: 'Séjour traversant ouvert sur la terrasse' },
      { seed: 'immovisia-trespoey-cuisine', alt: 'Cuisine équipée ouverte sur le séjour' },
      { seed: 'immovisia-trespoey-jardin', alt: 'Piscine et jardin clos' },
    ],
    coords: { lat: 43.3046, lng: -0.3521 },
  },
  {
    id: 'pyrenees',
    deal: 'vente',
    kind: 'Appartement',
    title: 'Balcon plein sud sur les Pyrénées',
    place: 'Boulevard des Pyrénées, Pau',
    summary:
      'Troisième étage avec ascenseur, balcon filant et vue dégagée sur la chaîne.',
    description: [
      'Appartement de 88 m² au troisième étage d’un immeuble de 1930, entièrement rénové en 2021. Parquet d’origine conservé et remis en état.',
      'Le balcon filant de 11 m² court sur toute la façade sud, face aux Pyrénées.',
    ],
    features: ['88 m²', '3 pièces', '2 chambres', 'Balcon 11 m²', 'Ascenseur', 'Cave'],
    price: '349 000 €',
    facts: [
      { label: 'Étage', value: '3e sur 5, avec ascenseur' },
      { label: 'Chauffage', value: 'Individuel gaz' },
      { label: 'DPE', value: 'C' },
      { label: 'Charges', value: '148 € par mois' },
    ],
    photo: { seed: 'immovisia-appart-pyrenees', alt: 'Appartement lumineux avec balcon, boulevard des Pyrénées à Pau' },
    gallery: [
      { seed: 'immovisia-pyrenees-balcon', alt: 'Balcon filant face aux Pyrénées' },
      { seed: 'immovisia-pyrenees-sejour', alt: 'Séjour avec parquet d’origine' },
    ],
    coords: { lat: 43.2949, lng: -0.3707 },
  },
  {
    id: 'halles',
    deal: 'vente',
    kind: 'Appartement',
    title: 'Deux pièces rénové, pierre apparente',
    place: 'Les Halles, Pau',
    summary: 'À cinquante mètres des Halles, rénové en 2023, sans travaux à prévoir.',
    description: [
      'Deux pièces de 54 m² au premier étage, murs en pierre apparente et poutres conservées lors de la rénovation de 2023.',
      'Idéal premier achat ou investissement locatif, le quartier des Halles restant le plus demandé du centre.',
    ],
    features: ['54 m²', '2 pièces', '1 chambre', 'Pierre apparente', 'Rénové 2023'],
    price: '187 400 €',
    facts: [
      { label: 'Étage', value: '1er sur 3, sans ascenseur' },
      { label: 'Chauffage', value: 'Électrique' },
      { label: 'DPE', value: 'D' },
      { label: 'Charges', value: '62 € par mois' },
    ],
    photo: { seed: 'immovisia-appart-halles', alt: 'Séjour d’un appartement rénové près des Halles de Pau' },
    gallery: [{ seed: 'immovisia-halles-cuisine', alt: 'Cuisine ouverte en pierre apparente' }],
    coords: { lat: 43.2963, lng: -0.3689 },
  },
  {
    id: 'jurancon',
    deal: 'vente',
    kind: 'Maison',
    title: 'Béarnaise rénovée, vue vignes',
    place: 'Jurançon',
    summary: 'Maison béarnaise sur les coteaux, jardin en restanques face au vignoble.',
    description: [
      'Maison béarnaise traditionnelle rénovée en 2019, posée sur les coteaux de Jurançon. Le jardin en restanques descend vers le vignoble.',
      'Charpente et galets apparents dans le séjour, cuisine d’été sous l’auvent.',
    ],
    features: ['156 m²', '5 pièces', '3 chambres', 'Jardin 900 m²', 'Cuisine d’été'],
    price: '428 500 €',
    facts: [
      { label: 'Année de rénovation', value: '2019' },
      { label: 'Chauffage', value: 'Granulés' },
      { label: 'DPE', value: 'C' },
      { label: 'Taxe foncière', value: '1 380 € par an' },
    ],
    photo: { seed: 'immovisia-maison-jurancon', alt: 'Maison béarnaise rénovée avec jardin à Jurançon' },
    gallery: [
      { seed: 'immovisia-jurancon-sejour', alt: 'Séjour avec galets et charpente apparents' },
      { seed: 'immovisia-jurancon-vignes', alt: 'Jardin en restanques face au vignoble' },
    ],
    coords: { lat: 43.2892, lng: -0.3833 },
  },
  {
    id: 'gan',
    deal: 'vente',
    kind: 'Maison',
    title: 'Familiale sur 2 400 m² arborés',
    place: 'Gan',
    summary: 'Sept pièces sur un terrain arboré, piscine chauffée et dépendance.',
    description: [
      'Maison familiale de 238 m² sur un terrain de 2 400 m² planté de chênes. Cinq chambres, dont deux au rez-de-chaussée.',
      'Piscine chauffée de 10 × 5 m et dépendance de 40 m² aménageable en bureau ou en studio.',
    ],
    features: ['238 m²', '7 pièces', '5 chambres', 'Piscine chauffée', 'Dépendance', 'Terrain 2 400 m²'],
    price: '615 000 €',
    facts: [
      { label: 'Année de construction', value: '1998' },
      { label: 'Chauffage', value: 'Pompe à chaleur' },
      { label: 'DPE', value: 'C' },
      { label: 'Taxe foncière', value: '1 890 € par an' },
    ],
    photo: { seed: 'immovisia-maison-gan', alt: 'Grande maison familiale avec piscine et terrain arboré à Gan' },
    gallery: [
      { seed: 'immovisia-gan-piscine', alt: 'Piscine chauffée et terrasse' },
      { seed: 'immovisia-gan-sejour', alt: 'Séjour familial ouvert sur le jardin' },
    ],
    coords: { lat: 43.2247, lng: -0.3856 },
  },

  {
    id: 'hedas',
    deal: 'location',
    kind: 'Appartement',
    title: 'Trois pièces meublé au Hédas',
    place: 'Le Hédas, Pau',
    summary: 'Meublé et équipé, au calme dans le vallon réaménagé du Hédas.',
    description: [
      'Trois pièces de 68 m² entièrement meublé, dans le vallon du Hédas réaménagé en 2019. Aucune circulation devant l’immeuble.',
      'Disponible immédiatement, bail d’un an renouvelable.',
    ],
    features: ['68 m²', '3 pièces', '2 chambres', 'Meublé', 'Au calme'],
    price: '780 € par mois',
    facts: [
      { label: 'Charges', value: '55 € par mois, provision' },
      { label: 'Dépôt de garantie', value: '780 €' },
      { label: 'Chauffage', value: 'Individuel gaz' },
      { label: 'DPE', value: 'D' },
    ],
    photo: { seed: 'immovisia-appart-hedas', alt: 'Séjour meublé d’un appartement au Hédas, à Pau' },
    gallery: [{ seed: 'immovisia-hedas-chambre', alt: 'Chambre meublée avec rangements' }],
    coords: { lat: 43.2938, lng: -0.3719 },
  },
  {
    id: 'lescar',
    deal: 'location',
    kind: 'Maison',
    title: 'Plain-pied avec jardin clos',
    place: 'Lescar',
    summary: 'Quatre pièces de plain-pied, jardin clos et garage, proche des écoles.',
    description: [
      'Maison de plain-pied de 104 m² avec jardin clos de 420 m², à cinq minutes des écoles et du centre de Lescar.',
      'Garage attenant et abri de jardin. Libre au 1er du mois suivant.',
    ],
    features: ['104 m²', '4 pièces', '3 chambres', 'Jardin clos', 'Garage'],
    price: '1 150 € par mois',
    facts: [
      { label: 'Charges', value: '30 € par mois, provision' },
      { label: 'Dépôt de garantie', value: '1 150 €' },
      { label: 'Chauffage', value: 'Pompe à chaleur' },
      { label: 'DPE', value: 'B' },
    ],
    photo: { seed: 'immovisia-maison-lescar', alt: 'Maison de plain-pied avec jardin clos à Lescar' },
    gallery: [{ seed: 'immovisia-lescar-jardin', alt: 'Jardin clos et terrasse' }],
    coords: { lat: 43.333, lng: -0.43 },
  },
  {
    id: 'campus',
    deal: 'location',
    kind: 'Appartement',
    title: 'Studio face au campus',
    place: 'Université, Pau',
    summary: 'Studio de 26 m² rénové, à deux cents mètres des amphithéâtres.',
    description: [
      'Studio de 26 m² rénové en 2024, kitchenette équipée et salle d’eau refaite. Résidence sécurisée avec local à vélos.',
      'À deux cents mètres de l’entrée du campus, ligne de bus directe vers le centre.',
    ],
    features: ['26 m²', '1 pièce', 'Meublé', 'Local à vélos', 'Rénové 2024'],
    price: '445 € par mois',
    facts: [
      { label: 'Charges', value: '40 € par mois, forfait' },
      { label: 'Dépôt de garantie', value: '445 €' },
      { label: 'Chauffage', value: 'Électrique' },
      { label: 'DPE', value: 'D' },
    ],
    photo: { seed: 'immovisia-studio-campus', alt: 'Studio rénové proche du campus de Pau' },
    gallery: [{ seed: 'immovisia-campus-kitchenette', alt: 'Kitchenette équipée du studio' }],
    coords: { lat: 43.3168, lng: -0.366 },
  },
  {
    id: 'billere',
    deal: 'location',
    kind: 'Appartement',
    title: 'Quatre pièces avec terrasse',
    place: 'Billère',
    summary: 'Dernier étage, terrasse de 18 m² plein ouest, place de parking.',
    description: [
      'Quatre pièces de 92 m² au dernier étage, avec une terrasse de 18 m² exposée plein ouest et sans vis-à-vis.',
      'Place de parking en sous-sol comprise. Résidence de 2011, ascenseur.',
    ],
    features: ['92 m²', '4 pièces', '3 chambres', 'Terrasse 18 m²', 'Parking', 'Ascenseur'],
    price: '960 € par mois',
    facts: [
      { label: 'Charges', value: '85 € par mois, provision' },
      { label: 'Dépôt de garantie', value: '960 €' },
      { label: 'Chauffage', value: 'Collectif gaz' },
      { label: 'DPE', value: 'C' },
    ],
    photo: { seed: 'immovisia-appart-billere', alt: 'Appartement avec terrasse au dernier étage à Billère' },
    gallery: [{ seed: 'immovisia-billere-terrasse', alt: 'Terrasse exposée plein ouest' }],
    coords: { lat: 43.3025, lng: -0.3944 },
  },
];

export const listingsByDeal = (deal: Deal) => listings.filter((l) => l.deal === deal);
export const findListing = (id: string) => listings.find((l) => l.id === id);
