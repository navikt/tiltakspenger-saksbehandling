import { BehandlingStatus, Utfall } from '../types/BehandlingTypes';
import { Opphold } from '../types/InstitusjonsoppholdTypes';
import { Deltagelse } from '../types/KvpTypes';
import {
  MeldekortdagStatus,
  Meldekortstatus,
  ReduksjonAvYtelse,
  Sats,
} from '../types/MeldekortTypes';
import { Kilde } from '../types/VilkårTypes';

export const finnKildetekst = (kilde: string) => {
  switch (kilde) {
    case Kilde.SØKNAD:
      return 'Søknad';
    case Kilde.PDL:
      return 'PDL';
    case Kilde.KOMET:
      return 'Komet';
    case Kilde.ARENA:
      return 'Arena';
  }
};

export const finnUtfallTekst = (utfall: Utfall) => {
  switch (utfall) {
    case Utfall.IKKE_OPPFYLT:
      return 'ikke oppfylt';
    case Utfall.OPPFYLT:
      return 'oppfylt';
    case Utfall.DELVIS_OPPFYLT:
      return 'delvis oppfylt';
    case Utfall.UAVKLART:
      return 'uavklart';
    default:
      return 'uavklart';
  }
};

export const lagFaktumTekstAvLivsopphold = (harLivsoppholdYtelser: boolean) => {
  return harLivsoppholdYtelser
    ? 'Søker har andre ytelser til livsopphold'
    : 'Søker har ikke andre ytelser til livsopphold';
};

export const lagFaktumTekst = (faktum: Deltagelse | Opphold) => {
  switch (faktum) {
    case Deltagelse.DELTAR_IKKE:
      return 'Søker deltar ikke';
    case Deltagelse.DELTAR:
      return 'Søker deltar';
    case Opphold.IKKE_OPPHOLD:
      return 'Søker oppholder seg ikke på institusjon';
    case Opphold.OPPHOLD:
      return 'Søker oppholder seg på institusjon';
    default:
      return 'Vilkåret er uavklart';
  }
};

export const finnStatusTekst = (status: string, underkjent: boolean) => {
  switch (status) {
    case BehandlingStatus.INNVILGET:
      return 'Innvilget';
    case BehandlingStatus.KLAR_TIL_BEHANDLING:
      return underkjent ? 'Underkjent' : 'Klar til behandling';
    case BehandlingStatus.KLAR_TIL_BESLUTNING:
      return 'Klar til beslutning';
    case BehandlingStatus.SØKNAD:
      return 'Søknad';
    case BehandlingStatus.UNDER_BEHANDLING:
      return underkjent ? 'Underkjent' : 'Under behandling';
    case BehandlingStatus.UNDER_BESLUTNING:
      return 'Under beslutning';
    case BehandlingStatus.KAN_BEHANDLES:
      return 'Kan behandles';
    case BehandlingStatus.KAN_IKKE_BEHANDLES:
      return 'Kan ikke behandles';
  }
};

export const finnMeldekortdagStatusTekst = (status: string) => {
  switch (status) {
    case MeldekortdagStatus.Sperret:
      return 'Sperret';
    case MeldekortdagStatus.DeltattMedLønnITiltaket:
      return 'Deltatt med lønn i tiltaket';
    case MeldekortdagStatus.DeltattUtenLønnITiltaket:
      return 'Deltatt uten lønn i tiltaket';
    case MeldekortdagStatus.FraværSyk:
      return 'Fravær - Syk';
    case MeldekortdagStatus.FraværSyktBarn:
      return 'Fravær - Sykt barn';
    case MeldekortdagStatus.FraværVelferdGodkjentAvNav:
      return 'Fravær - Velferd. Godkjent av NAV';
    case MeldekortdagStatus.FraværVelferdIkkeGodkjentAvNav:
      return 'Fravær - Velferd. Ikke godkjent av NAV';
    case MeldekortdagStatus.IkkeDeltatt:
      return 'Ikke deltatt i tiltaket';
    case MeldekortdagStatus.IkkeUtfylt:
      return 'Ikke utfylt';
  }
};
export const finnMeldekortstatusTekst = (status: string) => {
  switch (status) {
    case Meldekortstatus.KLAR_TIL_UTFYLLING:
      return 'Klar til utfylling';
    case Meldekortstatus.KLAR_TIL_BESLUTNING:
      return 'Klar til beslutning';
    case Meldekortstatus.GODKJENT:
      return 'Godkjent';
  }
};
