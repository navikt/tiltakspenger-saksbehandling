import styles from './Personoversikt.module.css';
import { ActionMenu, Box, Button, Heading, HStack, Tabs } from '@navikt/ds-react';
import { MeldekortOversikt } from './meldekort-oversikt/MeldekortOversikt';
import { ApneBehandlingerOversikt } from './behandlinger-oversikt/ApneBehandlingerOversikt';
import { OpprettRevurderingMenuItem } from './opprett-revurdering/OpprettRevurderingMenuItem';
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
import { OpprettSøknadMenuItem } from '~/components/personoversikt/manuell-søknad/OpprettSøknadMenuItem';
import { Tidslinjer } from '~/components/tidslinjer/Tidslinjer';
import router from 'next/router';
import { useFeatureToggles } from '~/context/feature-toggles/FeatureTogglesContext';
import {
    ChevronDownIcon,
    FileCheckmarkIcon,
    FileIcon,
    FilePlusIcon,
    FileXMarkIcon,
    InboxIcon,
} from '@navikt/aksel-icons';
import Divider from '~/components/divider/Divider';

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
                <HStack align={'center'} justify={'space-between'} className={styles.tittelRad}>
                    <Heading spacing size={'medium'} level={'2'}>
                        {'Personoversikt'}
                    </Heading>
                </HStack>

                <Tidslinjer sak={sak} heading={false} className={styles.tabellwrapper} />
                <Divider />
                <Tabs defaultValue={tabs.apneBehandlinger} className={styles.tabs}>
                    <Tabs.List className={styles.tabsList}>
                        <Tabs.Tab
                            value={tabs.apneBehandlinger}
                            label={labelWithCounter('Åpne behandlinger', åpneBehandlinger.length)}
                            icon={<FileIcon aria-hidden />}
                            className={styles.tab}
                        />
                        <Tabs.Tab
                            value={tabs.meldekort}
                            label={'Meldekort'}
                            icon={<InboxIcon aria-hidden />}
                            className={styles.tab}
                        />
                        <Tabs.Tab
                            value={tabs.vedtatteBehandlinger}
                            label={`Vedtatte behandlinger`}
                            icon={<FileCheckmarkIcon aria-hidden />}
                            className={styles.tab}
                        />
                        <Tabs.Tab
                            value={tabs.avsluttedeBehandlinger}
                            label="Avsluttede behandlinger"
                            icon={<FileXMarkIcon aria-hidden />}
                            className={styles.tab}
                        />
                        <ActionMenu>
                            <ActionMenu.Trigger>
                                <Button
                                    data-color="neutral"
                                    variant="tertiary"
                                    icon={<ChevronDownIcon aria-hidden />}
                                    iconPosition="right"
                                    className={styles.tab}
                                >
                                    Opprett behandling
                                </Button>
                            </ActionMenu.Trigger>
                            <ActionMenu.Content>
                                {featureToggle.klageToggle && (
                                    <ActionMenu.Item
                                        icon={<FilePlusIcon aria-hidden />}
                                        onSelect={() =>
                                            router.push(`/sak/${saksnummer}/klage/opprett`)
                                        }
                                    >
                                        Registrer klage
                                    </ActionMenu.Item>
                                )}
                                <OpprettSøknadMenuItem
                                    saksnummer={saksnummer}
                                    harVedtak={harVedtattSøknadsbehandling(behandlinger)}
                                />
                                <OpprettRevurderingMenuItem
                                    sakId={sakId}
                                    harVedtak={harVedtattSøknadsbehandling(behandlinger)}
                                />
                            </ActionMenu.Content>
                        </ActionMenu>
                    </Tabs.List>

                    <Tabs.Panel value={tabs.apneBehandlinger} className={styles.panel}>
                        <ApneBehandlingerOversikt åpneBehandlinger={åpneBehandlinger} />
                    </Tabs.Panel>
                    <Tabs.Panel value={tabs.meldekort} className={styles.panel}>
                        <div className={styles.meldekortHeaderRad}>
                            <MeldekortHelgToggle />
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
