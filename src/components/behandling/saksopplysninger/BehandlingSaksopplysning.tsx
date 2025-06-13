import { BodyShort } from '@navikt/ds-react';
import { classNames } from '../../../utils/classNames';
import { Periode } from '../../../types/Periode';
import { periodeTilFormatertDatotekst } from '../../../utils/date';

import style from './BehandlingSaksopplysning.module.css';

type Props = { navn: string; verdi: string; spacing?: boolean };

export const BehandlingSaksopplysning = ({ navn, verdi, spacing }: Props) => {
    return (
        <BodyShort
            size={'small'}
            className={classNames(style.opplysning, spacing && style.spacing)}
        >
            {`${navn}: `}
            <strong>{verdi}</strong>
        </BodyShort>
    );
};

type MedPeriodeProps = {
    navn: string;
    periode?: Periode;
    spacing?: boolean;
};

export const BehandlingSaksopplysningMedPeriode = ({ navn, periode, spacing }: MedPeriodeProps) => {
    return periode ? (
        <BehandlingSaksopplysning
            navn={navn}
            verdi={periodeTilFormatertDatotekst({
                fraOgMed: periode.fraOgMed,
                tilOgMed: periode.tilOgMed,
            })}
            spacing={spacing}
        />
    ) : (
        <BehandlingSaksopplysning navn={navn} verdi={'Nei'} spacing={spacing} />
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
