import { Box, Heading, HStack, Spacer } from '@navikt/ds-react';
import { BehandlingData, BehandlingStatus, Behandlingstype } from '../../types/BehandlingTypes';
import { MeldekortOversikt } from './meldekort-oversikt/MeldekortOversikt';
import { BehandlingerOversikt } from './behandlinger-oversikt/BehandlingerOversikt';
import { OpprettRevurdering } from './opprett-revurdering/OpprettRevurdering';
import { PersonaliaHeader } from '../personaliaheader/PersonaliaHeader';
import { useSak } from '../../context/sak/SakContext';
import { useFeatureToggles } from '../../context/feature-toggles/FeatureTogglesContext';

import styles from './Saksoversikt.module.css';
import { AvsluttedeBehandlinger } from './behandlinger-oversikt/AvsluttedeBehandlinger';

export const Saksoversikt = () => {
    const sak = useSak().sak;
    const { revurderingStansToggle } = useFeatureToggles();
    const meldeperioder = sak.meldeperiodeKjeder.flatMap((kjede) => kjede.meldeperioder);

    return (
        <>
            <PersonaliaHeader sakId={sak.sakId} saksnummer={sak.saksnummer} />
            <Box className={styles.wrapper}>
                <HStack align="center" style={{ marginBottom: '1rem' }}>
                    <Heading spacing size="medium" level="2">
                        Saksoversikt
                    </Heading>
                    <Spacer />
                    {revurderingStansToggle && (
                        <OpprettRevurdering
                            sakId={sak.sakId}
                            harVedtak={harVedtattFørstegangsbehandling(sak.behandlinger)}
                        />
                    )}
                </HStack>
                <Box className={styles.tabellwrapper}>
                    <Heading level={'3'} size={'small'}>
                        {'Behandlinger'}
                    </Heading>
                    <BehandlingerOversikt behandlinger={sak.behandlingsoversikt} />
                </Box>
                <AvsluttedeBehandlinger søknader={sak.søknader} behandlinger={sak.behandlinger} />

                <Box className={styles.tabellwrapper}>
                    <Heading level={'3'} size={'small'}>
                        {'Meldekort'}
                    </Heading>
                    <MeldekortOversikt meldeperioder={meldeperioder} saksnummer={sak.saksnummer} />
                </Box>
            </Box>
        </>
    );
};

const harVedtattFørstegangsbehandling = (behandlingsoversikt: BehandlingData[]) =>
    behandlingsoversikt.some(
        (behandling) =>
            behandling.type === Behandlingstype.FØRSTEGANGSBEHANDLING &&
            behandling.status === BehandlingStatus.VEDTATT,
    );
