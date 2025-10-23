import { Box, Heading } from '@navikt/ds-react';

import styles from '../Saksoversikt.module.css';

import { erBehandlingAvbrutt, erBehandlingVedtatt } from '~/utils/behandling';
import { VedtatteBehandlingerTabell } from './VedtatteBehandlingerTabell';
import { vedtattBehandlingToDataCellInfo } from '~/components/saksoversikt/behandlinger-oversikt/VedtatteBehandlingerUtils';
import { SøknadDTO } from '~/types/Søknad';
import { Rammebehandling } from '~/types/Behandling';

export const VedtatteBehandlinger = (props: {
    saksnummer: string;
    søknader: SøknadDTO[];
    behandlinger: Rammebehandling[];
}) => {
    const avsluttedeBehandlinger = props.behandlinger.filter(
        (b) => erBehandlingAvbrutt(b) || erBehandlingVedtatt(b),
    );

    const vedtatte = avsluttedeBehandlinger
        .map(vedtattBehandlingToDataCellInfo)
        .filter((avsluttet) => avsluttet.avsluttetPga === 'ferdigBehandlet')
        .toSorted((a, b) => a.tidspunktAvsluttet.localeCompare(b.tidspunktAvsluttet));

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
        </>
    );
};
