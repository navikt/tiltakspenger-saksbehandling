import React from 'react';
import { UtfallIkon } from '../utfallikon/UtfallIkon';
import IkonMedTekst from '../ikon-med-tekst/IkonMedTekst';
import { Utfall } from '../../types/BehandlingTypes';
import { lagUtfallstekst } from '../../utils/tekstformateringUtils';

interface UtfallstekstMedIkonProps {
  utfall: Utfall;
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
