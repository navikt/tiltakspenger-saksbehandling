import styles from './Personoversikt.module.css';
import { ActionMenu, Box, Button, Heading, HStack, Tabs } from '@navikt/ds-react';
import { MeldekortOversikt } from './meldekort-oversikt/MeldekortOversikt';
import { ApneBehandlingerOversikt } from './behandlinger-oversikt/ApneBehandlingerOversikt';
import { StartRevurderingModal } from './opprett-revurdering/StartRevurderingModal';
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
import { Tidslinjer } from '~/components/tidslinjer/Tidslinjer';
import { useRouter } from 'next/router';
import { useFeatureToggles } from '~/context/feature-toggles/FeatureTogglesContext';
import {
    ArrowsCirclepathIcon,
    ChevronDownIcon,
    FileCheckmarkIcon,
    FileIcon,
    FilePlusIcon,
    FileXMarkIcon,
    InboxIcon,
    TasklistSaveIcon,
} from '@navikt/aksel-icons';
import Divider from '~/components/divider/Divider';
import { useEffect, useState } from 'react';
import { OpprettSøknadModal } from '~/components/personoversikt/manuell-søknad/OpprettSøknadModal';
import { KlagebehandlingStatus } from '~/types/Klage';

export const PERSONOVERSIKT_TABS = {
    apneBehandlinger: 'apne-behandlinger',
    meldekort: 'meldekort',
    vedtatteBehandlinger: 'vedtatte-behandlinger',
    avsluttedeBehandlinger: 'avsluttede-behandlinger',
};

export const Personoversikt = () => {
    const router = useRouter();
    const { sak } = useSak();
    const featureToggle = useFeatureToggles();
    const [startRevurderingModalÅpen, setStartRevurderingModalÅpen] = useState(false);
    const [registrerSøknadManueltModalÅpen, setRegistrerSøknadManueltModalÅpen] = useState(false);

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

    const avbrutteRammebehandlinger = behandlinger.filter((behandling) => behandling.avbrutt);
    const avbrutteKlagebehandlinger = klageBehandlinger.filter(
        (klage) => klage.status === KlagebehandlingStatus.AVBRUTT,
    );

    const hentAktivTabFraHash = (hash: string) => {
        const tab = hash.replace(/^#/, '');
        return tab && Object.values(PERSONOVERSIKT_TABS).includes(tab)
            ? tab
            : PERSONOVERSIKT_TABS.apneBehandlinger;
    };

    const [aktivTab, setAktivTab] = useState<string>(PERSONOVERSIKT_TABS.apneBehandlinger);

    useEffect(() => {
        // TODO Gjorde lintingen strengere ved oppgradering til Next 16. Fikset bare åpenbare feil, denne burde undersøkes.
        /* eslint-disable-next-line react-hooks/set-state-in-effect */
        setAktivTab(hentAktivTabFraHash(window.location.hash));
    }, []);

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
                <Tabs
                    value={aktivTab}
                    className={styles.tabs}
                    onChange={(value) => {
                        setAktivTab(value);
                        router.replace(`/sak/${saksnummer}#${value}`, undefined, { shallow: true });
                    }}
                >
                    <Tabs.List className={styles.tabsList}>
                        <Tabs.Tab
                            value={PERSONOVERSIKT_TABS.apneBehandlinger}
                            label={labelWithCounter('Åpne behandlinger', åpneBehandlinger.length)}
                            icon={<FileIcon aria-hidden />}
                            className={styles.tab}
                        />
                        <Tabs.Tab
                            value={PERSONOVERSIKT_TABS.meldekort}
                            label={labelWithCounter(
                                'Meldekort',
                                meldeperiodeKjederKanBehandles?.length ?? 0,
                            )}
                            icon={<InboxIcon aria-hidden />}
                            className={styles.tab}
                        />
                        <Tabs.Tab
                            value={PERSONOVERSIKT_TABS.vedtatteBehandlinger}
                            label={labelWithCounter(
                                `Vedtatte behandlinger`,
                                alleRammevedtak.length + alleKlagevedtak.length,
                            )}
                            icon={<FileCheckmarkIcon aria-hidden />}
                            className={styles.tab}
                        />
                        <Tabs.Tab
                            value={PERSONOVERSIKT_TABS.avsluttedeBehandlinger}
                            label={labelWithCounter(
                                'Avsluttede behandlinger',
                                avbrutteRammebehandlinger.length + avbrutteKlagebehandlinger.length,
                            )}
                            icon={<FileXMarkIcon aria-hidden />}
                            className={styles.tab}
                        />
                        <ActionMenu>
                            <ActionMenu.Trigger>
                                <Button
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
                                <ActionMenu.Item
                                    icon={<TasklistSaveIcon aria-hidden />}
                                    onClick={() => setRegistrerSøknadManueltModalÅpen(true)}
                                >
                                    {'Registrer søknad manuelt'}
                                </ActionMenu.Item>

                                <ActionMenu.Item
                                    icon={<ArrowsCirclepathIcon aria-hidden />}
                                    onClick={() => setStartRevurderingModalÅpen(true)}
                                    disabled={!harVedtattSøknadsbehandling(behandlinger)}
                                >
                                    {'Opprett revurdering'}
                                </ActionMenu.Item>
                            </ActionMenu.Content>
                        </ActionMenu>
                    </Tabs.List>

                    <Tabs.Panel
                        value={PERSONOVERSIKT_TABS.apneBehandlinger}
                        className={styles.panel}
                    >
                        <ApneBehandlingerOversikt åpneBehandlinger={åpneBehandlinger} />
                    </Tabs.Panel>
                    <Tabs.Panel value={PERSONOVERSIKT_TABS.meldekort} className={styles.panel}>
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
                    <Tabs.Panel
                        value={PERSONOVERSIKT_TABS.vedtatteBehandlinger}
                        className={styles.panel}
                    >
                        <VedtatteBehandlinger
                            sakId={sakId}
                            rammebehandlinger={behandlinger}
                            alleRammevedtak={alleRammevedtak}
                            klagebehandlinger={klageBehandlinger}
                            alleKlagevedtak={alleKlagevedtak}
                        />
                    </Tabs.Panel>
                    <Tabs.Panel value={PERSONOVERSIKT_TABS.avsluttedeBehandlinger}>
                        <AvsluttedeBehandlinger
                            saksnummer={saksnummer}
                            avbrutteBehandlinger={avbrutteRammebehandlinger}
                            avbrutteKlageBehandlinger={avbrutteKlagebehandlinger}
                        />
                    </Tabs.Panel>
                </Tabs>
            </Box>
            <OpprettSøknadModal
                saksnummer={saksnummer}
                åpen={registrerSøknadManueltModalÅpen}
                setÅpen={setRegistrerSøknadManueltModalÅpen}
            />
            <StartRevurderingModal
                sakId={sakId}
                åpen={startRevurderingModalÅpen}
                setÅpen={setStartRevurderingModalÅpen}
            />
        </>
    );
};

const harVedtattSøknadsbehandling = (behandlingsoversikt: Rammebehandling[]) =>
    behandlingsoversikt.some(
        (behandling) =>
            behandling.type === Rammebehandlingstype.SØKNADSBEHANDLING &&
            behandling.status === Rammebehandlingsstatus.VEDTATT,
    );
