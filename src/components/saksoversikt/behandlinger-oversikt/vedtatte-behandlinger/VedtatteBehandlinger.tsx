import { Alert, Heading, VStack } from '@navikt/ds-react';
import { VedtatteBehandlingerTabell } from './VedtatteBehandlingerTabell';
import { Rammebehandling } from '~/types/Behandling';
import { SakId } from '~/types/Sak';
import { Rammevedtak, RammevedtakMedBehandling } from '~/types/Rammevedtak';

import styles from '../../Saksoversikt.module.css';

type Props = {
    sakId: SakId;
    behandlinger: Rammebehandling[];
    alleRammevedtak: Rammevedtak[];
};

export const VedtatteBehandlinger = ({ sakId, behandlinger, alleRammevedtak }: Props) => {
    if (alleRammevedtak.length === 0) {
        return null;
    }

    const vedtakMedBehandling = alleRammevedtak
        .map((vedtak) => {
            return {
                ...vedtak,
                behandling: behandlinger.find(
                    (behandling) => behandling.id === vedtak.behandlingId,
                ),
            };
        })
        .filter((vedtak): vedtak is RammevedtakMedBehandling => !!vedtak.behandling)
        .toSorted((a, b) => a.opprettet.localeCompare(b.opprettet));

    const antallVedtakUtenBehandling = alleRammevedtak.length - vedtakMedBehandling.length;

    return (
        <VStack className={styles.tabellwrapper} gap={'2'}>
            <Heading level="3" size="small">
                {'Vedtatte behandlinger'}
            </Heading>
            {antallVedtakUtenBehandling > 0 && (
                <Alert
                    variant={'error'}
                >{`Teknisk feil: ${antallVedtakUtenBehandling} vedtak mangler behandling på denne saken`}</Alert>
            )}
            <VedtatteBehandlingerTabell
                sakId={sakId}
                rammevedtakMedBehandlinger={vedtakMedBehandling}
            />
        </VStack>
    );
};
