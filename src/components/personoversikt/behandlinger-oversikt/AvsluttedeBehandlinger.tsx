import { Box } from '@navikt/ds-react';
import { AvbruttBehandlingCellInfo } from './AvsluttedeBehandlingerUtils';
import { AvbrutteBehandlingerTabell } from './AvbrutteBehandlingerTabell';
import { Rammebehandling } from '~/types/Rammebehandling';

import styles from '../Personoversikt.module.css';
import { Klagebehandling, KlagebehandlingResultat } from '~/types/Klage';

export const AvsluttedeBehandlinger = (props: {
    saksnummer: string;
    avbrutteBehandlinger: Rammebehandling[];
    avbrutteKlageBehandlinger: Klagebehandling[];
}) => {
    const avbrutteRammebehandlinger = props.avbrutteBehandlinger.map(
        avbruttBehandlingToDataCellInfo,
    );

    const avbrutteKlagebehandlinger = props.avbrutteKlageBehandlinger.map(
        avbruttKlageToDataCellInfo,
    );

    const avbrutteBehandlinger = [
        ...avbrutteRammebehandlinger,
        ...avbrutteKlagebehandlinger,
    ].toSorted((a, b) => b.tidspunktAvsluttet.localeCompare(a.tidspunktAvsluttet));

    if (avbrutteBehandlinger.length === 0) {
        return null;
    }

    return (
        <Box className={styles.panel}>
            <AvbrutteBehandlingerTabell
                avbrutteBehandlinger={avbrutteBehandlinger}
                saksnummer={props.saksnummer}
            />
        </Box>
    );
};

const avbruttBehandlingToDataCellInfo = (
    behandling: Rammebehandling,
): AvbruttBehandlingCellInfo => {
    const tidspunktAvsluttet = behandling.avbrutt?.avbruttTidspunkt
        ? behandling.avbrutt.avbruttTidspunkt
        : behandling.iverksattTidspunkt!;

    return {
        id: behandling.id,
        behandlingsperiode: behandling.vedtaksperiode,
        resultat: behandling.resultat,
        behandlingstype: behandling.type,
        tidspunktAvsluttet: tidspunktAvsluttet,
        avsluttetPga: behandling.avbrutt ? 'avbrutt' : 'ferdigBehandlet',
        saksbehandler: behandling.saksbehandler,
        beslutter: behandling.beslutter,
    };
};

const avbruttKlageToDataCellInfo = (klage: Klagebehandling): AvbruttBehandlingCellInfo => {
    return {
        id: klage.id,
        behandlingsperiode: null,
        resultat: klage.resultat ? klage.resultat : KlagebehandlingResultat.AVVIST,
        behandlingstype: 'KLAGEBEHANDLING',
        tidspunktAvsluttet: klage.sistEndret,
        avsluttetPga: 'avbrutt',
        saksbehandler: klage.saksbehandler ? klage.saksbehandler : 'Ukjent',
        beslutter: null,
    };
};
