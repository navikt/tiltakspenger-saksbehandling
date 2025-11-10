import { Box, Heading, HStack } from '@navikt/ds-react';
import { MeldekortOversikt } from './meldekort-oversikt/MeldekortOversikt';
import { ApneBehandlingerOversikt } from './behandlinger-oversikt/ApneBehandlingerOversikt';
import { OpprettRevurdering } from './opprett-revurdering/OpprettRevurdering';
import { PersonaliaHeader } from '../personaliaheader/PersonaliaHeader';
import { useSak } from '~/context/sak/SakContext';
import { AvsluttedeBehandlinger } from './behandlinger-oversikt/AvsluttedeBehandlinger';
import { MeldeperiodeKjedeStatus } from '~/types/meldekort/Meldeperiode';
import { MeldekortOversiktIkkeKlar } from './meldekort-oversikt/ikke-klar/MeldekortOversiktIkkeKlar';
import { VedtatteBehandlinger } from '~/components/personoversikt/behandlinger-oversikt/vedtatte-behandlinger/VedtatteBehandlinger';
import NotificationBanner from '../notificationBanner/NotificationBanner';
import MeldekortHelgToggle from '../toggles/MeldekortHelgToggle';
import {
    Rammebehandling,
    Rammebehandlingsstatus,
    Rammebehandlingstype,
} from '~/types/Rammebehandling';
import { OpprettPapirsøknad } from '~/components/personoversikt/papirsøknad/OpprettPapirsøknad';
import { useFeatureToggles } from '~/context/feature-toggles/FeatureTogglesContext';

import styles from './Personoversikt.module.css';

export const Personoversikt = () => {
    const { papirsøknadToggle } = useFeatureToggles();
    const {
        sakId,
        saksnummer,
        behandlinger,
        åpneBehandlinger,
        søknader,
        meldeperiodeKjeder,
        alleRammevedtak,
    } = useSak().sak;

    const { meldeperiodeKjederIkkeKlare, meldeperiodeKjederKanBehandles } = Object.groupBy(
        meldeperiodeKjeder,
        ({ status }) =>
            status === MeldeperiodeKjedeStatus.IKKE_KLAR_TIL_BEHANDLING
                ? 'meldeperiodeKjederIkkeKlare'
                : 'meldeperiodeKjederKanBehandles',
    );

    return (
        <>
            <NotificationBanner />
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer} />
            <Box className={styles.wrapper}>
                <HStack align={'center'} justify={'space-between'} className={styles.spacing}>
                    <Heading spacing size={'medium'} level={'2'}>
                        {'Personoversikt'}
                    </Heading>
                    <HStack gap="3">
                        <MeldekortHelgToggle />
                        {papirsøknadToggle && (
                            <OpprettPapirsøknad
                                saksnummer={saksnummer}
                                harVedtak={harVedtattSøknadsbehandling(behandlinger)}
                            />
                        )}
                        <OpprettRevurdering
                            sakId={sakId}
                            harVedtak={harVedtattSøknadsbehandling(behandlinger)}
                        />
                    </HStack>
                </HStack>

                <Box className={styles.tabellwrapper}>
                    <Heading level={'3'} size={'small'}>
                        {'Åpne behandlinger'}
                    </Heading>
                    <ApneBehandlingerOversikt åpneBehandlinger={åpneBehandlinger} />
                </Box>

                <VedtatteBehandlinger
                    sakId={sakId}
                    behandlinger={behandlinger}
                    alleRammevedtak={alleRammevedtak}
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
                    {meldeperiodeKjederKanBehandles && (
                        <MeldekortOversikt
                            meldeperiodeKjeder={meldeperiodeKjederKanBehandles}
                            saksnummer={saksnummer}
                            sakId={sakId}
                        />
                    )}
                </Box>
            </Box>
        </>
    );
};

const harVedtattSøknadsbehandling = (behandlingsoversikt: Rammebehandling[]) =>
    behandlingsoversikt.some(
        (behandling) =>
            behandling.type === Rammebehandlingstype.SØKNADSBEHANDLING &&
            behandling.status === Rammebehandlingsstatus.VEDTATT,
    );
