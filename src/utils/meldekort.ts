import { MeldekortStatus } from '../types/MeldekortTypes';

export function velgMeldekortdagStatus(status: string) {
  switch (status) {
    case 'Deltatt':
      return MeldekortStatus.DELTATT;
    case 'Ikke deltatt':
      return MeldekortStatus.IKKE_DELTATT;
    case 'Lønn for tid i arbeid':
      return MeldekortStatus.LØNN_FOR_TID_I_ARBEID;
    case 'Fravær syk':
      return MeldekortStatus.FRAVÆR_SYK;
    case 'Fravær sykt barn':
      return MeldekortStatus.FRAVÆR_SYKT_BARN;
    case 'Fravær velferd':
      return MeldekortStatus.FRAVÆR_VELFERD;
    default:
      return MeldekortStatus.IKKE_DELTATT;
  }
}
