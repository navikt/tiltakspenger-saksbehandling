import React from 'react';
import { Utfall } from '../../types/Utfall';
import { UtfallIkon } from '../utfall-ikon/UtfallIkon';
import IkonMedTekst from '../ikon-med-tekst/IkonMedTekst';

interface UtfallstekstMedIkonProps {
  utfall: Utfall;
}

function lagUtfallstekst(utfall: Utfall) {
  switch (utfall) {
    case Utfall.OPPFYLT:
      return 'Vilkåret er oppfylt i deler av/hele perioden';
    case Utfall.IKKE_OPPFYLT:
      return 'Vilkåret er ikke oppfylt';
    default:
      return 'Vilkåret er uavklart';
  }
}

const UtfallstekstMedIkon = ({ utfall }: UtfallstekstMedIkonProps) => {
  let utfallstekst = lagUtfallstekst(utfall);
  return (
    <IkonMedTekst
      iconRenderer={() => <UtfallIkon utfall={utfall} />}
      text={utfallstekst}
    />
  );
};

export default UtfallstekstMedIkon;
