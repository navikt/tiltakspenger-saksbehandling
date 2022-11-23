import React from 'react';
import { Utfall } from '../../types/Utfall';
import { ErrorColored, InformationColored, SuccessColored } from '@navikt/ds-icons';

interface UtfallIconProps {
    utfall: Utfall;
}

const UtfallIcon = ({ utfall }: UtfallIconProps) => {
    if (utfall === 'Oppfylt') return <SuccessColored />;
    if (utfall === 'IkkeOppfylt') return <ErrorColored />;
    return <InformationColored />;
};

export default UtfallIcon;
