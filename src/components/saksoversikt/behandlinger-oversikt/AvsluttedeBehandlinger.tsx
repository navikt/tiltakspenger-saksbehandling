import { Box, Heading } from '@navikt/ds-react';

import styles from '../Saksoversikt.module.css';
import { avbruttSøknadToDataCellInfo } from './AvsluttedeBehandlingerUtils';
import { SøknadForBehandlingProps } from '~/types/SøknadTypes';
import { BehandlingData } from '~/types/BehandlingTypes';
import {
    erBehandlingAvbrutt,
    erBehandlingSøknadsbehandling,
    erBehandlingVedtatt,
} from '~/utils/behandling';
import { erSøknadAvbrutt } from '~/utils/SøknadUtils';
import { AvbrutteBehandlingerTabell } from './AvbrutteBehandlingerTabell';

export const AvsluttedeBehandlinger = (props: {
    saksnummer: string;
    søknader: SøknadForBehandlingProps[];
    behandlinger: BehandlingData[];
}) => {
    const avsluttedeBehandlinger = props.behandlinger.filter(
        (b) => erBehandlingAvbrutt(b) || erBehandlingVedtatt(b),
    );
    const avbrutteSøknader = props.søknader
        .filter(erSøknadAvbrutt)
        .filter(
            (søknad) =>
                avsluttedeBehandlinger.find(
                    (behandling) =>
                        erBehandlingSøknadsbehandling(behandling) &&
                        behandling.søknad.id === søknad.id,
                ) === undefined,
        );

    const avbrutteSøknaderInfo = avbrutteSøknader.map(avbruttSøknadToDataCellInfo);

    const avbrutte = [...avbrutteSøknaderInfo]
        .toSorted((a, b) => a.tidspunktAvsluttet.localeCompare(b.tidspunktAvsluttet))
        .filter((avsluttet) => avsluttet.avsluttetPga === 'avbrutt');

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
