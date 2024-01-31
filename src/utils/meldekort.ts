import { MeldekortStatus } from '../types/MeldekortTypes';

export function velgMeldekortdagStatus(status: string) {
  switch (status) {
    case 'Ikke utfylt':
      return MeldekortStatus.IkkeUtfylt;
    case 'Deltatt':
      return MeldekortStatus.Deltatt;
    case 'Ikke deltatt':
      return MeldekortStatus.IkkeDeltatt;
    case 'Lønn for tid i arbeid':
      return MeldekortStatus.Lønn;
    case 'Fravær syk':
      return MeldekortStatus.FraværSyk;
    case 'Fravær sykt barn':
      return MeldekortStatus.FraværSyktBarn;
    case 'Fravær velferd':
      return MeldekortStatus.FraværVelferd;
    default:
      return MeldekortStatus.IkkeUtfylt;
  }
}
