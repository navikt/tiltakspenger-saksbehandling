import React from 'react';
import {
    XMarkOctagonFillIcon,
    CheckmarkCircleFillIcon,
    ExclamationmarkTriangleFillIcon,
} from '@navikt/aksel-icons';
import { Utfall } from '../../types/BehandlingTypes';

interface UtfallIkonProps {
    utfall: Utfall;
}

export const UtfallIkon = ({ utfall }: UtfallIkonProps) => {
    switch (utfall) {
        case Utfall.OPPFYLT || Utfall.DELVIS_OPPFYLT:
            return (
                <CheckmarkCircleFillIcon
                    width="1.5em"
                    height="1.5em"
                    color="var(--a-icon-success)"
                />
            );
        case Utfall.IKKE_OPPFYLT:
            return (
                <XMarkOctagonFillIcon width="1.5em" height="1.5em" color="var(--a-icon-danger)" />
            );
        case Utfall.UAVKLART:
            return (
                <ExclamationmarkTriangleFillIcon
                    width="1.5em"
                    height="1.5em"
                    color="var(--a-icon-warning)"
                />
            );
        default:
            return (
                <ExclamationmarkTriangleFillIcon
                    width="1.5em"
                    height="1.5em"
                    color="var(--a-icon-warning)"
                />
            );
    }
};
