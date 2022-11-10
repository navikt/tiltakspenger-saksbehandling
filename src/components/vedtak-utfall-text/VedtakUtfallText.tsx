import React from 'react';
import IconWithText from '../icon-with-text/IconWithText';
import { Utfall } from '../../types/Utfall';
import { ErrorColored, InformationColored, SuccessColored } from '@navikt/ds-icons';

interface VedtakUtfallText {
    utfall: Utfall;
}

function renderIcon(utfall: Utfall) {
    if (utfall === 'Oppfylt') return <SuccessColored />;
    if (utfall === 'IkkeOppfylt') return <ErrorColored />;
    return <InformationColored />;
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
    const iconRenderer = () => renderIcon(utfall);
    const utfallText = getUtfallText(utfall);
    return <IconWithText iconRenderer={iconRenderer} text={utfallText} />;
};

export default VedtakUtfallText;
