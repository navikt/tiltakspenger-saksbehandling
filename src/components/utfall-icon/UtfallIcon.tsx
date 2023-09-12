import React from 'react';
import { Utfall } from '../../types/Utfall';
import { ErrorColored, InformationColored, SuccessColored } from '@navikt/ds-icons';
import {CheckmarkCircleFillIcon, XMarkOctagonFillIcon} from "@navikt/aksel-icons";

interface UtfallIconProps {
    utfall: Utfall;
}

export const UtfallIcon = ({ utfall }: UtfallIconProps) => {
    if (utfall === Utfall.Oppfylt) return <SuccessColored />;
    if (utfall === Utfall.IkkeOppfylt) return <ErrorColored />;
    if (utfall === Utfall.KreverManuellVurdering) return <ErrorColored />;
    return <InformationColored />;
};

export const UtfallIconTo = ({ utfall }: UtfallIconProps) => {
    if (utfall === Utfall.Oppfylt) return <CheckmarkCircleFillIcon title="Vilkår oppfylt" fontSize="1.5rem" color={'#33AA5F'}/>;
    if (utfall === Utfall.IkkeOppfylt) return <XMarkOctagonFillIcon title="Vilkår ikke oppfylt" fontSize="1.5rem" color={'#C30000'}/>;
    return <InformationColored />;
};
