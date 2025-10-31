import { Box, Heading } from '@navikt/ds-react';

import styles from '../Saksoversikt.module.css';
import {
    avbruttBehandlingToDataCellInfo,
    avbruttSøknadToDataCellInfo,
} from './AvsluttedeBehandlingerUtils';

import { erBehandlingAvbrutt, erBehandlingVedtatt } from '~/utils/behandling';
import { AvbrutteBehandlingerTabell } from './AvbrutteBehandlingerTabell';
import { Søknad } from '~/types/Søknad';
import { Rammebehandling } from '~/types/Rammebehandling';

export const AvsluttedeBehandlinger = (props: {
    saksnummer: string;
    søknader: Søknad[];
    behandlinger: Rammebehandling[];
}) => {
    const avsluttedeBehandlinger = props.behandlinger.filter(
        (b) => erBehandlingAvbrutt(b) || erBehandlingVedtatt(b),
    );

    const behandlinger = avsluttedeBehandlinger
        .filter((behandling) => behandling.avbrutt)
        .map(avbruttBehandlingToDataCellInfo);
    const søknader = props.søknader
        .filter((søknad) => søknad.avbrutt)
        .map(avbruttSøknadToDataCellInfo);

    const avbrutte = [...behandlinger, ...søknader].toSorted((a, b) =>
        a.tidspunktAvsluttet.localeCompare(b.tidspunktAvsluttet),
    );

    return (
        <>
            {avbrutte.length > 0 && (
                <Box className={styles.tabellwrapper}>
                    <Heading level="3" size="small">
                        Avsluttede behandlinger
                    </Heading>
                    <AvbrutteBehandlingerTabell
                        avbrutteBehandlinger={avbrutte}
                        saksnummer={props.saksnummer}
                    />
                </Box>
            )}
        </>
    );
};
