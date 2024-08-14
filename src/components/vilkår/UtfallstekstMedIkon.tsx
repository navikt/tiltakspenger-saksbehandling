import React from 'react';
import { UtfallIkon } from '../utfallikon/UtfallIkon';
import IkonMedTekst from '../ikon-med-tekst/IkonMedTekst';
import { SamletUtfall } from '../../types/BehandlingTypes';

interface UtfallstekstMedIkonProps {
  samletUtfall: SamletUtfall;
}

function lagUtfallstekst(samletUtfall: SamletUtfall) {
  switch (samletUtfall) {
    case SamletUtfall.OPPFYLT:
      return 'Vilkåret er oppfylt i hele perioden';
    case SamletUtfall.IKKE_OPPFYLT:
      return 'Vilkåret er ikke oppfylt';
    case SamletUtfall.DELVIS_OPPFYLT:
      return 'Vilkåret er delvis oppfylt';
    case SamletUtfall.UAVKLART:
      return 'Vilkåret er uavklart';
    default:
      return 'Vilkåret er uavklart';
  }
}

const UtfallstekstMedIkon = ({ samletUtfall }: UtfallstekstMedIkonProps) => {
  const utfallstekst = lagUtfallstekst(samletUtfall);
  return (
    <IkonMedTekst
      iconRenderer={() => <UtfallIkon utfall={samletUtfall} />}
      text={utfallstekst}
    />
  );
};

export default UtfallstekstMedIkon;
