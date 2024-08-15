import React from 'react';
import { UtfallIkon } from '../utfallikon/UtfallIkon';
import IkonMedTekst from '../ikon-med-tekst/IkonMedTekst';
import { Utfall } from '../../types/BehandlingTypes';

interface UtfallstekstMedIkonProps {
  utfall: Utfall;
}

function lagUtfallstekst(utfall: string) {
  switch (utfall) {
    case Utfall.OPPFYLT:
      return 'Vilkåret er oppfylt i hele perioden';
    case Utfall.IKKE_OPPFYLT:
      return 'Vilkåret er ikke oppfylt';
    case Utfall.DELVIS_OPPFYLT:
      return 'Vilkåret er delvis oppfylt';
    case Utfall.UAVKLART:
      return 'Vilkåret er uavklart';
    default:
      return 'Vilkåret er uavklart';
  }
}

const UtfallstekstMedIkon = ({ utfall }: UtfallstekstMedIkonProps) => {
  const utfallstekst = lagUtfallstekst(utfall);
  return (
    <IkonMedTekst
      iconRenderer={() => <UtfallIkon utfall={utfall} />}
      text={utfallstekst}
    />
  );
};

export default UtfallstekstMedIkon;
