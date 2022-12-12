import React from 'react';
import AnnenYtelseAlertMessage from '../annen-ytelse-alert-message/AnnenYtelseAlertMessage';

const HarKvpDeltakelseMelding = () => {
    return (
        <AnnenYtelseAlertMessage
            heading={`Bruker har i søknaden oppgitt deltakelse ved Kvalifiseringsprogrammet.`}
            content={<p>Søknaden trenger manuell behandling.</p>}
        />
    );
};
export default HarKvpDeltakelseMelding;
