import React from 'react';
import style from './BehandlingSaksopplysning.module.css';
import { BodyShort } from '@navikt/ds-react';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { Periode } from '~/types/Periode';
import { PeriodeSpm } from '~/types/Søknad';
import { periodeTilFormatertDatotekst } from '~/utils/date';
import { classNames } from '~/utils/classNames';
import { formaterSøknadsspørsmålSvar } from '~/utils/tekstformateringUtils';

type Props = { navn: string; verdi: string; spacing?: boolean; visVarsel?: boolean };

export const BehandlingSaksopplysning = ({ navn, verdi, spacing, visVarsel = false }: Props) => {
    return (
        <div className={visVarsel ? classNames(style.soknadsopplysningVarsel) : ''}>
            <BodyShort
                size={'small'}
                className={classNames(style.opplysning, spacing && style.spacing)}
            >
                {`${navn}: `}
                <strong>{formaterSøknadsspørsmålSvar(verdi)}</strong>
            </BodyShort>
            {visVarsel && <ExclamationmarkTriangleFillIcon />}
        </div>
    );
};
type MedPeriodeProps = {
    navn: string;
    periodeSpm: PeriodeSpm;
    spacing?: boolean;
    visVarsel: boolean;
};

export const BehandlingSaksopplysningMedPeriodeSpm = ({
    navn,
    periodeSpm,
    spacing,
    visVarsel,
}: MedPeriodeProps) => {
    return periodeSpm.periode && visVarsel ? (
        <BehandlingSaksopplysning
            navn={navn}
            verdi={`${formaterSøknadsspørsmålSvar(periodeSpm.svar)} (${periodeTilFormatertDatotekst(
                {
                    fraOgMed: periodeSpm.periode.fraOgMed,
                    tilOgMed: periodeSpm.periode.tilOgMed,
                },
            )})
            `}
            spacing={spacing}
            visVarsel={visVarsel}
        />
    ) : (
        <BehandlingSaksopplysning
            navn={navn}
            verdi={periodeSpm.svar}
            spacing={spacing}
            visVarsel={visVarsel}
        />
    );
};

type MedFlerePerioderProps = {
    navn: string;
    perioder: Periode[];
    spacing?: boolean;
};

export const BehandlingSaksopplysningMedFlerePerioder = ({
    navn,
    perioder,
    spacing,
}: MedFlerePerioderProps) => {
    const verdier = perioder.map((periode) =>
        periodeTilFormatertDatotekst({
            fraOgMed: periode.fraOgMed,
            tilOgMed: periode.tilOgMed,
        }),
    );
    return (
        <BodyShort
            size={'small'}
            className={classNames(style.opplysning, spacing && style.spacing)}
        >
            {`${navn}: `}
            <br />
            {verdier.map((verdi) => (
                <strong key={navn + verdi}>
                    {verdi}
                    <br />
                </strong>
            ))}
        </BodyShort>
    );
};
