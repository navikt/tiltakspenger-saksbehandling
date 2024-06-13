import { Utfall } from '../types/Utfall';

export const finnUtfallTekst = (utfall: string) => {
  switch (utfall) {
    case Utfall.IKKE_OPPFYLT:
      return 'ikke oppfylt';
    case Utfall.OPPFYLT:
      return 'oppfylt';
    case Utfall.KREVER_MANUELL_VURDERING:
      return 'uavklart';
    default:
      return 'uavklart';
  }
};
