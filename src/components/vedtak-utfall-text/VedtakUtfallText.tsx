import React from 'react';
import IconWithText from '../icon-with-text/IconWithText';
import { Utfall } from '../../types/Utfall';
import UtfallIcon from '../utfall-icon/UtfallIcon';

interface VedtakUtfallText {
    utfall: Utfall;
}

function getUtfallText(utfall: Utfall) {
    switch (utfall) {
        case Utfall.Oppfylt:
            return 'Nei';
        case Utfall.IkkeOppfylt:
            return 'Ja';
        case Utfall.IkkeImplementert:
            return 'Mangler';
        case Utfall.KreverManuellVurdering:
            return 'Krever manuell vurdering';
    }
}

const VedtakUtfallText = ({ utfall }: VedtakUtfallText) => {
    const utfallText = getUtfallText(utfall);
    const utfallIconRenderer = () => <UtfallIcon utfall={utfall} />;
    return <IconWithText iconRenderer={utfallIconRenderer} text={utfallText} />;
};

export default VedtakUtfallText;
