import React from 'react';
import { ÅpenPeriode } from '../../types/Periode';
import { formatÅpenPeriode } from '../../utils/date';
import AnnenYtelseAlertMessage from '../annen-ytelse-alert-message/AnnenYtelseAlertMessage';

interface HarLønnsinntektMeldingProps {
    perioder: ÅpenPeriode[];
}

const HarLønnsinntektMelding = ({ perioder }: HarLønnsinntektMeldingProps) => {
    return (
        <AnnenYtelseAlertMessage
            heading={`Bruker har i søknaden oppgitt lønnsinntekt i følgende perioder:`}
            content={
                <React.Fragment>
                    <ul>
                        {perioder.map((periode) => {
                            const formattertPeriode = formatÅpenPeriode(periode);
                            return <li key={formattertPeriode}>{formattertPeriode}</li>;
                        })}
                    </ul>
                    <p>Søknaden trenger manuell behandling.</p>
                </React.Fragment>
            }
        />
    );
};
export default HarLønnsinntektMelding;
