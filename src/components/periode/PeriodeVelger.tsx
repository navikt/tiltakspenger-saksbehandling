import React from 'react';
import { Datovelger, DatovelgerProps } from '../datovelger/Datovelger';
import { HStack } from '@navikt/ds-react';

export type PeriodeVelgerProps = {
    fraOgMed: DatovelgerProps;
    tilOgMed: DatovelgerProps;
    size?: DatovelgerProps['size'];
    readOnly?: boolean;
};

export const PeriodeVelger = ({
    size = 'small',
    readOnly,
    fraOgMed,
    tilOgMed,
}: PeriodeVelgerProps) => {
    return (
        <HStack gap="4">
            <Datovelger readOnly={readOnly} size={size} {...fraOgMed} />
            <Datovelger readOnly={readOnly} size={size} {...tilOgMed} />
        </HStack>
    );
};
