import React from 'react';
import { ÅpenPeriode } from '../../types/Periode';
import { formatÅpenPeriode } from '../../utils/date';
import AnnenYtelseAlertMessage from '../annen-ytelse-alert-message/AnnenYtelseAlertMessage';

interface HarPensjonsordningMeldingProps {
  perioder: ÅpenPeriode[];
}

const HarPensjonsordningMelding = ({
  perioder,
}: HarPensjonsordningMeldingProps) => {
  return (
    <AnnenYtelseAlertMessage
      heading={`Bruker har i søknaden oppgitt å motta pensjonsordning i følgende perioder:`}
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
export default HarPensjonsordningMelding;
