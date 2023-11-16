import React from 'react';
import { XMarkOctagonFillIcon, InformationSquareFillIcon, CheckmarkCircleFillIcon } from '@navikt/aksel-icons';

interface UtfallIconProps {
    utfall: string;
}

export const UtfallIcon = ({ utfall }: UtfallIconProps) => {
    if (utfall === 'OPPFYLT') return <CheckmarkCircleFillIcon width="1.5em" height="1.5em" color="#007C2E" />;
    if (utfall === 'IKKE_OPPFYLT') return <XMarkOctagonFillIcon width="1.5em" height="1.5em" color="#C30000" />;
    if (utfall === 'KREVER_MANUELL_VURDERING')
        return <InformationSquareFillIcon width="1.5em" height="1.5em" color="#236B7D" />;
    return <InformationSquareFillIcon width="1.5em" height="1.5em" color="#236B7D" />;
};
