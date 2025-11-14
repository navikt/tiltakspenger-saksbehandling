import React from 'react';
import { DateOrString, Datovelger } from '../datovelger/Datovelger';
import { Nullable } from '~/types/UtilTypes';
import { datoTilDatoInputText } from '~/utils/date';
import { HStack } from '@navikt/ds-react';

const PeriodeForm = (props: {
    fraOgMed: {
        label: string;
        value: Nullable<DateOrString>;
        onChange: (date: Date | undefined) => void;
        error: Nullable<string>;
    };
    tilOgMed: {
        label: string;
        value: Nullable<DateOrString>;
        onChange: (date: Date | undefined) => void;
        error: Nullable<string>;
    };
    size?: 'medium' | 'small';
    minDate?: DateOrString;
    maxDate?: DateOrString;
    readOnly?: boolean;
}) => {
    return (
        <HStack gap="4">
            <Datovelger
                selected={props.fraOgMed.value ?? undefined}
                value={
                    props.fraOgMed.value ? datoTilDatoInputText(props.fraOgMed.value) : undefined
                }
                minDate={props.minDate}
                maxDate={props.maxDate}
                label={props.fraOgMed.label}
                size={props.size ?? 'small'}
                readOnly={props.readOnly}
                onDateChange={props.fraOgMed.onChange}
                error={props.fraOgMed.error}
            />
            <Datovelger
                selected={props.tilOgMed.value ?? undefined}
                value={
                    props.tilOgMed.value ? datoTilDatoInputText(props.tilOgMed.value) : undefined
                }
                minDate={props.minDate}
                maxDate={props.maxDate}
                label={props.tilOgMed.label}
                size={props.size ?? 'small'}
                readOnly={props.readOnly}
                onDateChange={props.tilOgMed.onChange}
                error={props.tilOgMed.error}
            />
        </HStack>
    );
};

export default PeriodeForm;
