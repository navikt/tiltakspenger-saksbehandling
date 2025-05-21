import { Box, Heading } from '@navikt/ds-react';

import styles from '../Saksoversikt.module.css';
import {
    avbruttSøknadToDataCellInfo,
    avsluttetBehandlingToDataCellInfo,
} from './AvsluttedeBehandlingerUtils';
import { SøknadForBehandlingProps } from '../../../types/SøknadTypes';
import { BehandlingData } from '../../../types/BehandlingTypes';
import {
    erBehandlingAbrutt as erBehandlingAvbrutt,
    erBehandlingFørstegangsbehandling,
    erBehandlingVedtatt,
} from '../../../utils/behandling';
import { erSøknadAvbrutt } from '../../../utils/SøknadUtils';
import { VedtatteBehandlingerTabell } from './VedtatteBehandlingerTabell';
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
                        erBehandlingFørstegangsbehandling(behandling) &&
                        behandling.søknad.id === søknad.id,
                ) === undefined,
        );

    const avsluttedeBehandlingerInfo = avsluttedeBehandlinger.map(
        avsluttetBehandlingToDataCellInfo,
    );
    const avbrutteSøknaderInfo = avbrutteSøknader.map(avbruttSøknadToDataCellInfo);

    const avsluttede = [...avsluttedeBehandlingerInfo, ...avbrutteSøknaderInfo].toSorted((a, b) =>
        a.tidspunktAvsluttet.localeCompare(b.tidspunktAvsluttet),
    );

    const vedtatte = avsluttede.filter((avsluttet) => avsluttet.avsluttetPga === 'ferdigBehandlet');
    const avbrutte = avsluttede.filter((avsluttet) => avsluttet.avsluttetPga === 'avbrutt');

    return (
        <>
            {vedtatte.length > 0 && (
                <Box className={styles.tabellwrapper}>
                    <Heading level="3" size="small">
                        Vedtatte behandlinger
                    </Heading>
                    <VedtatteBehandlingerTabell vedtatteBehandlinger={vedtatte} />
                </Box>
            )}
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
