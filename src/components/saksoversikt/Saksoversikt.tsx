import { Box, Heading, HStack, Spacer } from '@navikt/ds-react';
import {
    BehandlingForOversiktData,
    BehandlingStatus,
    Behandlingstype,
} from '../../types/BehandlingTypes';
import { MeldekortOversikt } from './meldekort-oversikt/MeldekortOversikt';
import { BehandlingerOversikt } from './behandlinger-oversikt/BehandlingerOversikt';
import { useFeatureToggles } from '../../hooks/useFeatureToggles';
import { OpprettRevurdering } from './opprett-revurdering/OpprettRevurdering';
import { PersonaliaHeader } from '../personaliaheader/PersonaliaHeader';
import { useSak } from '../../context/sak/useSak';

import styles from './Saksoversikt.module.css';

export const Saksoversikt = () => {
    const { revurderingStansToggle } = useFeatureToggles();

    const { sak } = useSak();
    const { sakId, saksnummer, behandlingsoversikt, meldeperiodeoversikt } = sak;

    return (
        <>
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer} />
            <Box className={styles.wrapper}>
                <HStack align="center" style={{ marginBottom: '1rem' }}>
                    <Heading spacing size="medium" level="2">
                        Saksoversikt
                    </Heading>
                    <Spacer />
                    {revurderingStansToggle && (
                        <OpprettRevurdering
                            sakId={sakId}
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
                    <MeldekortOversikt
                        meldeperioder={meldeperiodeoversikt}
                        saksnummer={saksnummer}
                    />
                </Box>
            </Box>
        </>
    );
};

const harVedtattFørstegangsbehandling = (behandlingsoversikt: BehandlingForOversiktData[]) =>
    behandlingsoversikt.some(
        (behandling) =>
            behandling.typeBehandling === Behandlingstype.FØRSTEGANGSBEHANDLING &&
            behandling.status === BehandlingStatus.VEDTATT,
    );
