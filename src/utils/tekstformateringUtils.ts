import { BehandlingStatus } from '../types/BehandlingTypes';
import { Opphold } from '../types/InstitusjonsoppholdTypes';
import { Deltagelse } from '../types/KvpTypes';
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

export const finnUtfallsperiodetekst = (utfall: string) => {
  switch (utfall) {
    case 'OPPFYLT':
      return 'Søker har oppfylt vilkårene for hele vurderingsperioden';
    case 'IKKE_OPPFYLT':
      return 'Søker har ikke oppfylt vilkårene for vurderingsperioden';
    case 'KREVER_MANUELL_VURDERING':
      return 'Totalvurdering er uavklart';
    default:
      return 'Totalvurdering er uavklart ';
  }
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


export const finnStatusTekst = (status: string) => {
  switch (status) {
    case BehandlingStatus.INNVILGET : return 'Innvilget'
    case BehandlingStatus.KLAR_TIL_BEHANDLING : return 'Klar til behandling'
    case BehandlingStatus.KLAR_TIL_BESLUTNING : return 'Klar til beslutning'
    case BehandlingStatus.SØKNAD : return 'Søknad'
    case BehandlingStatus.UNDER_BEHANDLING : return 'Under behandling'
    case BehandlingStatus.UNDER_BESLUTNING : return 'Under beslutning'
  }

}