import React from 'react';
import { Button, HStack, VStack } from '@navikt/ds-react';
import { MedPeriode } from '~/types/Periode';
import { Nullable } from '~/types/UtilTypes';
import { PeriodeVelger } from '~/components/periode/PeriodeVelger';
import { DateOrString, datoTilDatoInputText } from '~/utils/date';

const MultiperiodeForm = <T extends MedPeriode[]>(props: {
    name: string;
    perioder: T;
    nyPeriodeButtonConfig: {
        onClick: () => void;
        disabled?: boolean;
        hidden?: boolean;
        adjacentContent?: {
            content: React.ReactNode;
            position?: 'before' | 'after';
        };
    };
    fjernPeriodeButtonConfig: {
        text?: string;
        onClick: (index: number) => void;
        hidden?: boolean;
    };
    periodeConfig: {
        fraOgMed: {
            onChange: (date: Date | undefined, idx: number) => void;
            error?: Nullable<string>;
        };
        tilOgMed: {
            onChange: (date: Date | undefined, idx: number) => void;
            error?: Nullable<string>;
        };
        minDate?: DateOrString;
        maxDate?: DateOrString;
        size?: 'medium' | 'small';
        readOnly?: boolean;
    };
    contentConfig: {
        content: (periode: T[number], index: number) => React.ReactNode;
        position?: 'before' | 'after';
    };
}) => {
    return (
        <VStack gap="4" align="start">
            <VStack gap="4" as={'ul'}>
                {props.perioder.map((periode, index) => (
                    <HStack align="end" gap="4" key={`${props.name}-${index}`} as={'li'}>
                        {props.contentConfig.position === 'before' &&
                            props.contentConfig.content(periode, index)}
                        <PeriodeVelger
                            fraOgMed={{
                                label: 'Fra og med',
                                selected: periode.periode.fraOgMed,
                                value: datoTilDatoInputText(periode.periode.fraOgMed),
                                onDateChange: (date) =>
                                    props.periodeConfig.fraOgMed.onChange(date, index),
                                error: props.periodeConfig.fraOgMed.error,
                                minDate: props.periodeConfig.minDate,
                                maxDate: props.periodeConfig.maxDate,
                            }}
                            tilOgMed={{
                                label: 'Til og med',
                                selected: periode.periode.tilOgMed,
                                value: datoTilDatoInputText(periode.periode.tilOgMed),
                                onDateChange: (date) =>
                                    props.periodeConfig.tilOgMed.onChange(date, index),
                                error: props.periodeConfig.tilOgMed.error,
                                minDate: props.periodeConfig.minDate,
                                maxDate: props.periodeConfig.maxDate,
                            }}
                            size={props.periodeConfig.size}
                            readOnly={props.periodeConfig.readOnly}
                        />

                        {(props.contentConfig.position === 'after' ||
                            !props.contentConfig.position) &&
                            props.contentConfig.content(periode, index)}

                        {!props.fjernPeriodeButtonConfig.hidden && (
                            <Button
                                type={'button'}
                                variant={'tertiary'}
                                size={'small'}
                                onClick={() => props.fjernPeriodeButtonConfig.onClick(index)}
                            >
                                {props.fjernPeriodeButtonConfig.text || 'Fjern periode'}
                            </Button>
                        )}
                    </HStack>
                ))}
            </VStack>

            <HStack gap="4">
                {props.nyPeriodeButtonConfig.adjacentContent?.position === 'before' &&
                    props.nyPeriodeButtonConfig.adjacentContent.content}

                <Button
                    variant={'secondary'}
                    type={'button'}
                    size={'small'}
                    onClick={props.nyPeriodeButtonConfig.onClick}
                    disabled={props.nyPeriodeButtonConfig.disabled}
                >
                    Ny periode
                </Button>
                {(props.nyPeriodeButtonConfig.adjacentContent?.position === 'after' ||
                    !props.nyPeriodeButtonConfig.adjacentContent?.position) &&
                    props.nyPeriodeButtonConfig?.adjacentContent?.content}
            </HStack>
        </VStack>
    );
};

export default MultiperiodeForm;
