import React from 'react';
import IkonMedTekst from '../ikon-med-tekst/IkonMedTekst';
import { Utfall } from '../../types/Utfall';
import { UtfallIkon } from '../utfall-ikon/UtfallIkon';

interface VedtakUtfallText {
  utfall: Utfall;
  getUtfallText?: (utfall: Utfall) => string;
}

function getDefaultUtfallText(utfall: Utfall) {
  switch (utfall) {
    case Utfall.Oppfylt:
      return 'Nei';
    case Utfall.IkkeOppfylt:
      return 'Ja';
    case Utfall.KreverManuellVurdering:
      return 'Krever manuell vurdering';
  }
}

const VedtakUtfallText = ({ utfall, getUtfallText }: VedtakUtfallText) => {
  const utfallText = getUtfallText
    ? getUtfallText(utfall)
    : getDefaultUtfallText(utfall);
  const utfallIconRenderer = () => <UtfallIkon utfall={utfall} />;
  return <IkonMedTekst iconRenderer={utfallIconRenderer} text={utfallText} />;
};

export default VedtakUtfallText;
