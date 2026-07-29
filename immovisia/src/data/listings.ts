export interface Listing {
  id: string;
  kind: 'Maison' | 'Appartement';
  title: string;
  place: string;
  specs: string[];
  price: string;
  photo: { src: string; width: number; height: number; alt: string };
  /** Column span in the 12-column bento, and the media aspect it carries. */
  span: 5 | 7 | 12;
  media: 'wide' | 'tall' | 'panorama';
}

/** Sample inventory. Replace with the agency's real listings before going live. */
export const listings: Listing[] = [
  {
    id: 'trespoey',
    kind: 'Maison',
    title: 'Contemporaine sur parc clos',
    place: 'Trespoëy, Pau',
    specs: ['214 m²', '6 pièces', '4 chambres'],
    price: '742 000 €',
    photo: {
      src: 'https://picsum.photos/seed/immovisia-maison-trespoey/1200/800',
      width: 1200,
      height: 800,
      alt: 'Maison contemporaine avec terrasse, quartier Trespoëy à Pau',
    },
    span: 7,
    media: 'wide',
  },
  {
    id: 'pyrenees',
    kind: 'Appartement',
    title: 'Balcon plein sud sur les Pyrénées',
    place: 'Boulevard des Pyrénées, Pau',
    specs: ['88 m²', '3 pièces', '2 chambres'],
    price: '349 000 €',
    photo: {
      src: 'https://picsum.photos/seed/immovisia-appart-pyrenees/800/1000',
      width: 800,
      height: 1000,
      alt: 'Appartement lumineux avec balcon, boulevard des Pyrénées à Pau',
    },
    span: 5,
    media: 'tall',
  },
  {
    id: 'halles',
    kind: 'Appartement',
    title: 'Deux pièces rénové, pierre apparente',
    place: 'Les Halles, Pau',
    specs: ['54 m²', '2 pièces', '1 chambre'],
    price: '187 400 €',
    photo: {
      src: 'https://picsum.photos/seed/immovisia-appart-halles/800/1000',
      width: 800,
      height: 1000,
      alt: 'Séjour d’un appartement rénové près des Halles de Pau',
    },
    span: 5,
    media: 'tall',
  },
  {
    id: 'jurancon',
    kind: 'Maison',
    title: 'Béarnaise rénovée, vue vignes',
    place: 'Jurançon',
    specs: ['156 m²', '5 pièces', '3 chambres'],
    price: '428 500 €',
    photo: {
      src: 'https://picsum.photos/seed/immovisia-maison-jurancon/1200/800',
      width: 1200,
      height: 800,
      alt: 'Maison béarnaise rénovée avec jardin à Jurançon',
    },
    span: 7,
    media: 'wide',
  },
  {
    id: 'gan',
    kind: 'Maison',
    title: 'Familiale sur 2 400 m² arborés',
    place: 'Gan',
    specs: ['238 m²', '7 pièces', '5 chambres', 'Piscine'],
    price: '615 000 €',
    photo: {
      src: 'https://picsum.photos/seed/immovisia-maison-gan/1200/750',
      width: 1200,
      height: 750,
      alt: 'Grande maison familiale avec piscine et terrain arboré à Gan',
    },
    span: 12,
    media: 'panorama',
  },
];
