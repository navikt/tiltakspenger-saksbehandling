import { useSøknadsbehandling } from '~/components/behandling/BehandlingContext';
import { Alert } from '@navikt/ds-react';
import React from 'react';
import style from './SøknadsbehandlingAutomatiskBehandling.module.css';
import { TekstListe } from '~/components/liste/TekstListe';
import { manueltBehandlesGrunnTekst } from '~/utils/tekstformateringUtils';

export const SøknadsbehandlingAutomatiskBehandling = () => {
    const { behandling } = useSøknadsbehandling();
    const manueltBehandlesGrunnerTekst = behandling.manueltBehandlesGrunner.map(
        (grunn) => manueltBehandlesGrunnTekst[grunn],
    );

    return (
        <>
            {behandling.automatiskSaksbehandlet && (
                <Alert variant="info" size="small" className={style.infoboks}>
                    Saksbehandlingen er gjort automatisk.
                </Alert>
            )}
            {manueltBehandlesGrunnerTekst.length > 0 && (
                <Alert variant="warning" size="small" className={style.infoboks}>
                    Kunne ikke behandle saken automatisk:
                    <br />
                    <TekstListe tekster={manueltBehandlesGrunnerTekst} />
                </Alert>
            )}
        </>
    );
};
