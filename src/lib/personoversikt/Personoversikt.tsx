import { Heading, Tabs } from '@navikt/ds-react';
import { ApneBehandlingerOversikt } from './behandlinger-oversikt/ApneBehandlingerOversikt';
import { PersonaliaHeader } from '../personaliaheader/PersonaliaHeader';
import { useSak } from '~/lib/sak/SakContext';
import { AvbrutteBehandlingerOversikt } from './avbrutte-behandlinger/AvbrutteBehandlingerOversikt';
import { VedtatteBehandlinger } from '~/lib/personoversikt/vedtatte-behandlinger/VedtatteBehandlinger';
import NotificationBanner from '~/lib/_felles/notifications/NotificationBanner';
import { Tidslinjer } from '~/lib/_felles/tidslinjer/Tidslinjer';
import { useRouter } from 'next/router';
import {
    BankNoteIcon,
    EnvelopeClosedIcon,
    FileCheckmarkIcon,
    FileIcon,
    FileXMarkIcon,
    InboxIcon,
} from '@navikt/aksel-icons';
import { useEffect, useState } from 'react';
import { OpprettBehandlingMeny } from '~/lib/personoversikt/opprett-behandling/OpprettBehandlingMeny';
import { TilbakekrevingOversikt } from '~/lib/personoversikt/tilbakekreving/TilbakekrevingOversikt';
import { personoversiktUrl } from '~/utils/urls';
import { MeldekortOversikt } from '~/lib/personoversikt/meldekort-oversikt/MeldekortOversikt';
import { classNames } from '~/utils/classNames';
import { Klageoversikt } from './klageoversikt/Klageoversikt';

import styles from './Personoversikt.module.css';

export enum PersonoversiktTab {
    ÅpneBehandlinger = 'apne-behandlinger',
    Meldekort = 'Meldekort',
    VedtatteBehandlinger = 'vedtatte-behandlinger',
    AvsluttedeBehandlinger = 'avsluttede-behandlinger',
    Klage = 'Klage',
    Tilbakekreving = 'Tilbakekreving',
}

const DEFAULT_TAB = PersonoversiktTab.ÅpneBehandlinger;

export const Personoversikt = () => {
    const router = useRouter();
    const { sak } = useSak();

    const {
        sakId,
        saksnummer,
        rammebehandlinger,
        klagebehandlinger,
        alleRammevedtak,
        alleKlagevedtak,
        tilbakekrevinger,
        meldeperiodeKjeder,
    } = sak;

    const [aktivTab, setAktivTab] = useState<PersonoversiktTab>(DEFAULT_TAB);

    useEffect(() => {
        /* eslint-disable-next-line react-hooks/set-state-in-effect */
        setAktivTab(hentAktivTabFraHash(window.location.hash));
    }, []);

    const avbrutteRammebehandlinger = rammebehandlinger.filter(
        (behandling) => !!behandling.avbrutt,
    );
    const avbrutteKlagebehandlinger = klagebehandlinger.filter((klage) => !!klage.avbrutt);

    return (
        <>
            <NotificationBanner />
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer} />

            <Heading size={'medium'} level={'1'} className={styles.tittel}>
                {'Personoversikt'}
            </Heading>

            <Tidslinjer sak={sak} heading={false} className={styles.tidslinje} />

            <Tabs
                value={aktivTab}
                className={styles.tabs}
                onChange={(value) => {
                    setAktivTab(value as PersonoversiktTab);
                    router.replace(
                        personoversiktUrl(saksnummer, value as PersonoversiktTab),
                        undefined,
                        { shallow: true },
                    );
                }}
            >
                <Tabs.List className={styles.tabsList}>
                    <Tabs.Tab
                        value={PersonoversiktTab.ÅpneBehandlinger}
                        label={'Åpne behandlinger'}
                        icon={<FileIcon aria-hidden />}
                        className={styles.tab}
                    />
                    <Tabs.Tab
                        value={PersonoversiktTab.Meldekort}
                        label={labelWithCounter('Meldekort', meldeperiodeKjeder.length)}
                        icon={<InboxIcon aria-hidden />}
                        className={styles.tab}
                    />
                    <Tabs.Tab
                        value={PersonoversiktTab.VedtatteBehandlinger}
                        label={labelWithCounter(
                            `Vedtatte behandlinger`,
                            alleRammevedtak.length + alleKlagevedtak.length,
                        )}
                        icon={<FileCheckmarkIcon aria-hidden />}
                        className={styles.tab}
                    />
                    <Tabs.Tab
                        value={PersonoversiktTab.AvsluttedeBehandlinger}
                        label={labelWithCounter(
                            'Avsluttede behandlinger',
                            avbrutteRammebehandlinger.length + avbrutteKlagebehandlinger.length,
                        )}
                        icon={<FileXMarkIcon aria-hidden />}
                        className={styles.tab}
                    />
                    <Tabs.Tab
                        value={PersonoversiktTab.Klage}
                        label={labelWithCounter('Klage', klagebehandlinger.length)}
                        icon={<EnvelopeClosedIcon aria-hidden />}
                        className={styles.tab}
                    />
                    <Tabs.Tab
                        value={PersonoversiktTab.Tilbakekreving}
                        label={labelWithCounter('Tilbakekreving', tilbakekrevinger.length)}
                        icon={<BankNoteIcon aria-hidden />}
                        className={styles.tab}
                    />

                    <OpprettBehandlingMeny
                        sakId={sakId}
                        saksnummer={saksnummer}
                        behandlinger={rammebehandlinger}
                        className={classNames(styles.opprettBehandling, styles.tab)}
                    />
                </Tabs.List>

                <Tabs.Panel value={PersonoversiktTab.ÅpneBehandlinger} className={styles.panel}>
                    <ApneBehandlingerOversikt />
                </Tabs.Panel>

                <Tabs.Panel value={PersonoversiktTab.Meldekort} className={styles.panel}>
                    <MeldekortOversikt />
                </Tabs.Panel>

                <Tabs.Panel value={PersonoversiktTab.VedtatteBehandlinger} className={styles.panel}>
                    <VedtatteBehandlinger />
                </Tabs.Panel>

                <Tabs.Panel
                    value={PersonoversiktTab.AvsluttedeBehandlinger}
                    className={styles.panel}
                >
                    <AvbrutteBehandlingerOversikt
                        saksnummer={saksnummer}
                        avbrutteRammebehandlinger={avbrutteRammebehandlinger}
                        avbrutteKlagebehandlinger={avbrutteKlagebehandlinger}
                    />
                </Tabs.Panel>

                <Tabs.Panel value={PersonoversiktTab.Klage} className={styles.panel}>
                    <Klageoversikt />
                </Tabs.Panel>

                <Tabs.Panel value={PersonoversiktTab.Tilbakekreving} className={styles.panel}>
                    <TilbakekrevingOversikt />
                </Tabs.Panel>
            </Tabs>
        </>
    );
};

const labelWithCounter = (label: string, count: number) => {
    return `${label} (${count})`;
};

const hentAktivTabFraHash = (hash: string) => {
    const tab = hash.replace(/^#/, '');
    return Object.values(PersonoversiktTab).includes(tab as PersonoversiktTab)
        ? (tab as PersonoversiktTab)
        : DEFAULT_TAB;
};
