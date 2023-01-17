import React from 'react';
import { Alert } from '@navikt/ds-react';
import { Periode, ÅpenPeriode } from '../../types/Periode';
import { formatPeriode, formatÅpenPeriode } from '../../utils/date';

interface BrukerFyller18ÅrIPeriodenMeldingProps {
    periode: Periode | ÅpenPeriode;
}

const BrukerFyller18ÅrIPeriodenMelding = ({ periode }: BrukerFyller18ÅrIPeriodenMeldingProps) => {
    return (
        <Alert variant="error" style={{ marginTop: '1rem' }}>
            <span>
                Bruker har ikke fylt 18 år i deler av perioden det er søkt tiltakspenger for:
                <ul style={{ marginTop: '0.5rem', marginBottom: '0' }}>
                    <li>
                        {periode.til ? formatPeriode(periode as Periode) : formatÅpenPeriode(periode as ÅpenPeriode)}
                    </li>
                </ul>
            </span>
        </Alert>
    );
};

export default BrukerFyller18ÅrIPeriodenMelding;
