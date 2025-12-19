import { Box, Heading } from '@navikt/ds-react';
import { AvbruttBehandlingCellInfo } from './AvsluttedeBehandlingerUtils';
import { AvbrutteBehandlingerTabell } from './AvbrutteBehandlingerTabell';
import { Rammebehandling } from '~/types/Rammebehandling';

import styles from '../Personoversikt.module.css';

export const AvsluttedeBehandlinger = (props: {
    saksnummer: string;
    behandlinger: Rammebehandling[];
}) => {
    const avbrutteBehandlinger = props.behandlinger
        .filter((behandling) => behandling.avbrutt)
        .map(avbruttBehandlingToDataCellInfo)
        .toSorted((a, b) => b.tidspunktAvsluttet.localeCompare(a.tidspunktAvsluttet));

    if (avbrutteBehandlinger.length === 0) {
        return null;
    }

    return (
        <Box className={styles.tabellwrapper}>
            <Heading level="3" size="small">
                Avsluttede behandlinger
            </Heading>
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
