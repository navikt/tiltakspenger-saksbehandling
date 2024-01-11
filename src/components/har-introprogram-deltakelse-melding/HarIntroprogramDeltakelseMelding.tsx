import React from 'react';
import { ÅpenPeriode } from '../../types/Periode';
import { formatÅpenPeriode } from '../../utils/date';
import AnnenYtelseAlertMessage from '../annen-ytelse-alert-message/AnnenYtelseAlertMessage';

interface HarKommunalYtelseMeldingProps {
  perioder: ÅpenPeriode[];
}

const HarIntroprogramDeltakelseMelding = ({
  perioder,
}: HarKommunalYtelseMeldingProps) => {
  return (
    <AnnenYtelseAlertMessage
      heading={`Bruker har svart ja på deltakelse ved Introduksjonsprogrammet i følgende perioder:`}
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
export default HarIntroprogramDeltakelseMelding;
