import { Opphold } from './InstitusjonsoppholdTypes';
import { Deltagelse } from './KvpTypes';

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
