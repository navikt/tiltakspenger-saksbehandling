import { Box, Heading, HStack, Spacer } from '@navikt/ds-react';
import {
    BehandlingForOversiktData,
    BehandlingStatus,
    Behandlingstype,
} from '../../types/BehandlingTypes';
import { MeldeperiodeProps } from '../../types/meldekort/Meldeperiode';
import { MeldekortOversikt } from './meldekort-oversikt/MeldekortOversikt';
import { BehandlingerOversikt } from './behandlinger-oversikt/BehandlingerOversikt';
import { useFeatureToggles } from '../../hooks/useFeatureToggles';
import { OpprettRevurdering } from './revurder-stans/OpprettRevurdering';
import { SakId } from '../../types/SakTypes';

import styles from './Saksoversikt.module.css';

type SaksoversiktProps = {
    behandlingsoversikt: BehandlingForOversiktData[];
    meldeperioder: MeldeperiodeProps[];
    saksnummer: string;
    sakId: SakId;
};

export const Saksoversikt = ({
    behandlingsoversikt,
    meldeperioder,
    saksnummer,
    sakId,
}: SaksoversiktProps) => {
    const { revurderingStansToggle } = useFeatureToggles();

    return (
        <Box className={styles.wrapper}>
            <HStack align="center" style={{ marginBottom: '1rem' }}>
                <Heading spacing size="medium" level="2">
                    Saksoversikt
                </Heading>
                <Spacer />
                {revurderingStansToggle && (
                    <OpprettRevurdering
                        sakId={sakId}
                        saksnummer={saksnummer}
                        harVedtak={harVedtattFørstegangsbehandling(behandlingsoversikt)}
                    />
                )}
            </HStack>
            <Box className={styles.tabellwrapper}>
                <Heading level={'3'} size={'small'}>
                    {'Behandlinger'}
                </Heading>
                <BehandlingerOversikt behandlinger={behandlingsoversikt} />
            </Box>
            <Box className={styles.tabellwrapper}>
                <Heading level={'3'} size={'small'}>
                    {'Meldekort'}
                </Heading>
                <MeldekortOversikt meldeperioder={meldeperioder} saksnummer={saksnummer} />
            </Box>
        </Box>
    );
};

const harVedtattFørstegangsbehandling = (behandlingsoversikt: BehandlingForOversiktData[]) =>
    behandlingsoversikt.some(
        (behandling) =>
            behandling.typeBehandling === Behandlingstype.FØRSTEGANGSBEHANDLING &&
            behandling.status === BehandlingStatus.VEDTATT,
    );
