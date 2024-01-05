import React from 'react';
import AnnenYtelseAlertMessage from '../annen-ytelse-alert-message/AnnenYtelseAlertMessage';

const HarInstitusjonsoppholdMelding = () => {
  return (
    <AnnenYtelseAlertMessage
      heading={`Bruker har i søknaden oppgitt å være på institusjonsopphold.`}
      content={<p>Søknaden trenger manuell behandling.</p>}
    />
  );
};
export default HarInstitusjonsoppholdMelding;
