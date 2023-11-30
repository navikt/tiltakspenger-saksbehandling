import React from 'react';
import { XMarkOctagonFillIcon, InformationSquareFillIcon, CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';

interface UtfallIconProps {
    utfall: string;
}

export const UtfallIcon = ({ utfall }: UtfallIconProps) => {
    if (utfall === 'OPPFYLT') return <CheckmarkCircleFillIcon width="1.5em" height="1.5em" color="var(--a-icon-success)" />;
    if (utfall === 'IKKE_OPPFYLT') return <XMarkOctagonFillIcon width="1.5em" height="1.5em" color="var(--a-icon-danger)" />;
    if (utfall === 'KREVER_MANUELL_VURDERING')
        return <ExclamationmarkTriangleFillIcon width="1.5em" height="1.5em" color="var(--a-icon-warning)" />;
    return <InformationSquareFillIcon width="1.5em" height="1.5em" color="var(--a-icon-info)" />;
};
