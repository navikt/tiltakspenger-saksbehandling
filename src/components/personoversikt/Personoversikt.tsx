import { Box, Button, Heading, HStack, Tabs } from '@navikt/ds-react';
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
import { OpprettSøknad } from '~/components/personoversikt/manuell-søknad/OpprettSøknad';

import styles from './Personoversikt.module.css';
import { Tidslinjer } from '~/components/tidslinjer/Tidslinjer';
import router from 'next/router';
import { useFeatureToggles } from '~/context/feature-toggles/FeatureTogglesContext';
import { FileCheckmarkIcon, FileIcon, FileXMarkIcon, InboxIcon } from '@navikt/aksel-icons';

export const Personoversikt = () => {
    const { sak } = useSak();
    const featureToggle = useFeatureToggles();

    const {
        sakId,
        saksnummer,
        behandlinger,
        åpneBehandlinger,
        klageBehandlinger,
        meldeperiodeKjeder,
        alleRammevedtak,
        alleKlagevedtak,
    } = sak;

    const { meldeperiodeKjederIkkeKlare, meldeperiodeKjederKanBehandles } = Object.groupBy(
        meldeperiodeKjeder,
        ({ status }) =>
            status === MeldeperiodeKjedeStatus.IKKE_KLAR_TIL_BEHANDLING
                ? 'meldeperiodeKjederIkkeKlare'
                : 'meldeperiodeKjederKanBehandles',
    );

    const tabs = {
        apneBehandlinger: 'apne-behandlinger',
        meldekort: 'meldekort',
        vedtatteBehandlinger: 'vedtatte-behandlinger',
        avsluttedeBehandlinger: 'avsluttede-behandlinger',
    };

    const labelWithCounter = (label: string, count?: number) => {
        if (count && count > 0) {
            return `${label} (${count})`;
        } else {
            return label;
        }
    };

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
                        {featureToggle.klageToggle && (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => router.push(`/sak/${saksnummer}/klage/opprett`)}
                            >
                                Registrer klage
                            </Button>
                        )}
                        <OpprettSøknad
                            saksnummer={saksnummer}
                            harVedtak={harVedtattSøknadsbehandling(behandlinger)}
                        />
                        <OpprettRevurdering
                            sakId={sakId}
                            harVedtak={harVedtattSøknadsbehandling(behandlinger)}
                        />
                    </HStack>
                </HStack>

                <Tidslinjer sak={sak} className={styles.tabellwrapper} />

                <Tabs defaultValue={tabs.apneBehandlinger} className={styles.tabellwrapper}>
                    <Tabs.List>
                        <Tabs.Tab
                            value={tabs.apneBehandlinger}
                            label={labelWithCounter('Åpne behandlinger', åpneBehandlinger.length)}
                            icon={<FileIcon aria-hidden />}
                        />
                        <Tabs.Tab
                            value={tabs.meldekort}
                            label={'Meldekort'}
                            icon={<InboxIcon aria-hidden />}
                        />
                        <Tabs.Tab
                            value={tabs.vedtatteBehandlinger}
                            label={`Vedtatte behandlinger`}
                            icon={<FileCheckmarkIcon aria-hidden />}
                        />
                        <Tabs.Tab
                            value={tabs.avsluttedeBehandlinger}
                            label="Avsluttede behandlinger"
                            icon={<FileXMarkIcon aria-hidden />}
                        />
                    </Tabs.List>
                    <Tabs.Panel value={tabs.apneBehandlinger} className={styles.panel}>
                        <Heading level={'3'} size={'small'}>
                            {'Åpne behandlinger'}
                        </Heading>
                        <ApneBehandlingerOversikt åpneBehandlinger={åpneBehandlinger} />
                    </Tabs.Panel>
                    <Tabs.Panel value={tabs.meldekort} className={styles.panel}>
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
                    </Tabs.Panel>
                    <Tabs.Panel value={tabs.vedtatteBehandlinger} className={styles.panel}>
                        <VedtatteBehandlinger
                            sakId={sakId}
                            rammebehandlinger={behandlinger}
                            alleRammevedtak={alleRammevedtak}
                            klagebehandlinger={klageBehandlinger}
                            alleKlagevedtak={alleKlagevedtak}
                        />
                    </Tabs.Panel>
                    <Tabs.Panel value={tabs.avsluttedeBehandlinger}>
                        <AvsluttedeBehandlinger
                            behandlinger={behandlinger}
                            saksnummer={saksnummer}
                            klageBehandlinger={klageBehandlinger}
                        />
                    </Tabs.Panel>
                </Tabs>
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
