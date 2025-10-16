import { Box, Heading, HStack, Spacer } from '@navikt/ds-react';
import { BehandlingData, BehandlingStatus, Behandlingstype } from '~/types/BehandlingTypes';
import { MeldekortOversikt } from './meldekort-oversikt/MeldekortOversikt';
import { BehandlingerOversikt } from './behandlinger-oversikt/BehandlingerOversikt';
import { OpprettRevurdering } from './opprett-revurdering/OpprettRevurdering';
import { PersonaliaHeader } from '../personaliaheader/PersonaliaHeader';
import { useSak } from '~/context/sak/SakContext';
import { AvsluttedeBehandlinger } from './behandlinger-oversikt/AvsluttedeBehandlinger';
import { MeldeperiodeKjedeStatus } from '~/types/meldekort/Meldeperiode';
import { MeldekortOversiktIkkeKlar } from './meldekort-oversikt/ikke-klar/MeldekortOversiktIkkeKlar';

import styles from './Saksoversikt.module.css';
import { VedtatteBehandlinger } from '~/components/saksoversikt/behandlinger-oversikt/VedtatteBehandlinger';
import NotificationBanner from '../notificationBanner/NotificationBanner';

export const Saksoversikt = () => {
    const {
        sakId,
        saksnummer,
        behandlinger,
        behandlingsoversikt,
        søknader,
        meldeperiodeKjeder,
        kanSendeInnHelgForMeldekort,
    } = useSak().sak;

    const { meldeperiodeKjederIkkeKlare, meldeperiodeKjederKlare } = Object.groupBy(
        meldeperiodeKjeder,
        ({ status }) =>
            status === MeldeperiodeKjedeStatus.IKKE_KLAR_TIL_BEHANDLING
                ? 'meldeperiodeKjederIkkeKlare'
                : 'meldeperiodeKjederKlare',
    );
    const meldeperiodekjederSomKreverBehandling = meldeperiodeKjeder.filter((kjede) => {
        const apneMeldekortbehandlinger = kjede.meldekortBehandlinger.filter((mb) => {
            return !mb.erAvsluttet;
        });
        return (
            apneMeldekortbehandlinger.length > 0 ||
            kjede.status === MeldeperiodeKjedeStatus.KLAR_TIL_BEHANDLING ||
            kjede.status === MeldeperiodeKjedeStatus.UNDER_BEHANDLING ||
            kjede.status === MeldeperiodeKjedeStatus.UNDER_BESLUTNING ||
            kjede.status === MeldeperiodeKjedeStatus.KLAR_TIL_BESLUTNING ||
            kjede.status === MeldeperiodeKjedeStatus.KORRIGERT_MELDEKORT
        );
    });

    return (
        <>
            <NotificationBanner />
            <PersonaliaHeader
                sakId={sakId}
                saksnummer={saksnummer}
                kanSendeInnHelgForMeldekort={kanSendeInnHelgForMeldekort}
            />
            <Box className={styles.wrapper}>
                <HStack align="center" className={styles.spacing}>
                    <Heading spacing size="medium" level="2">
                        Saksoversikt
                    </Heading>
                    <Spacer />
                    <OpprettRevurdering
                        sakId={sakId}
                        harVedtak={harVedtattSøknadsbehandling(behandlinger)}
                    />
                </HStack>
                <Box className={styles.tabellwrapper}>
                    <Heading level={'3'} size={'small'}>
                        {'Behandlinger'}
                    </Heading>
                    <BehandlingerOversikt
                        behandlinger={behandlingsoversikt}
                        meldeperiodeKjeder={meldeperiodekjederSomKreverBehandling}
                        saksnummer={saksnummer}
                        sakId={sakId}
                    />
                </Box>
                <VedtatteBehandlinger
                    saksnummer={saksnummer}
                    søknader={søknader}
                    behandlinger={behandlinger}
                />
                <AvsluttedeBehandlinger
                    søknader={søknader}
                    behandlinger={behandlinger}
                    saksnummer={saksnummer}
                />

                <Box className={styles.tabellwrapper}>
                    <div className={styles.meldekortHeaderRad}>
                        <Heading level={'3'} size={'small'}>
                            {'Meldekort'}
                        </Heading>
                        {meldeperiodeKjederIkkeKlare && (
                            <MeldekortOversiktIkkeKlar
                                meldeperiodeKjeder={meldeperiodeKjederIkkeKlare}
                            />
                        )}
                    </div>
                    {meldeperiodeKjederKlare && (
                        <MeldekortOversikt
                            meldeperiodeKjeder={meldeperiodeKjederKlare}
                            saksnummer={saksnummer}
                            sakId={sakId}
                        />
                    )}
                </Box>
            </Box>
        </>
    );
};

const harVedtattSøknadsbehandling = (behandlingsoversikt: BehandlingData[]) =>
    behandlingsoversikt.some(
        (behandling) =>
            behandling.type === Behandlingstype.SØKNADSBEHANDLING &&
            behandling.status === BehandlingStatus.VEDTATT,
    );
