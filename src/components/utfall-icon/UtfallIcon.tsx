import React from 'react';
import { ErrorColored, InformationColored, SuccessColored } from '@navikt/ds-icons';

interface UtfallIconProps {
    utfall: string;
}

export const UtfallIcon = ({ utfall }: UtfallIconProps) => {
    if (utfall === "OPPFYLT") return <SuccessColored />;
    if (utfall === "IKKE_OPPFYLT") return <ErrorColored />;
    if (utfall === "KREVER_MANUELL_VURDERING") return <InformationColored />;
    return <InformationColored />;
};
