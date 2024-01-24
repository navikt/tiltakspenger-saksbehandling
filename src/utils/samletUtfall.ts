import { Kategori } from '../types/Behandling';

interface Utfall {
  variant: 'success' | 'error' | 'warning';
  tekst: string;
  altTekst?: string;
}

export const samletUtfall = (sakskategorier: Kategori[]): Utfall => {
  if (
    !!sakskategorier.find(
      (kategori) => kategori.samletUtfall === 'KREVER_MANUELL_VURDERING'
    )
  ) {
    return {
      variant: 'warning',
      tekst: 'Krever manuell saksbehandling',
    };
  }
  if (
    !!sakskategorier.find(
      (kategori) => kategori.samletUtfall === 'IKKE_OPPFYLT'
    )
  ) {
    return {
      variant: 'error',
      tekst: 'Vilkår for tiltakspenger er ikke oppfylt for perioden.',
      altTekst: 'Søknaden kan ikke behandles videre i denne løsningen.',
    };
  }
  return {
    variant: 'success',
    tekst: 'Vilkår for tiltakspenger er oppfylt for perioden',
  };
};
