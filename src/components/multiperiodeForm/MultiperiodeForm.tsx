import React from 'react';
import PeriodeForm from '../periode/PeriodeForm';
import { Button, HStack, VStack } from '@navikt/ds-react';
import { MedPeriode } from '~/types/Periode';
import { Nullable } from '~/types/UtilTypes';
import { DateOrString } from '../datovelger/Datovelger';

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
                        <PeriodeForm
                            fraOgMed={{
                                label: 'Fra og med',
                                value: periode.periode.fraOgMed,
                                onChange: (date) =>
                                    props.periodeConfig.fraOgMed.onChange(date, index),
                                error: props.periodeConfig.fraOgMed.error ?? null,
                            }}
                            tilOgMed={{
                                label: 'Til og med',
                                value: periode.periode.tilOgMed,
                                onChange: (date) =>
                                    props.periodeConfig.tilOgMed.onChange(date, index),
                                error: props.periodeConfig.tilOgMed.error ?? null,
                            }}
                            minDate={props.periodeConfig.minDate}
                            maxDate={props.periodeConfig.maxDate}
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
