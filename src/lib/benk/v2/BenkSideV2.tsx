import { Heading, Tabs, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import NotificationBanner from '~/lib/_felles/notifications/NotificationBanner';
import { BenkV2Oversikt, BenkV2Sortering } from './typer/felles';
import { BenkV2Tab, benkV2TabTekst } from './typer/tabs';
import { BenkSøknaderFilter, BenkSøknaderKolonne, BenkSøknadsbehandling } from './typer/søknader';
import {
    BenkRevurderingerFilter,
    BenkRevurderingerKolonne,
    BenkRevurdering,
} from './typer/revurderinger';
import { BenkMeldekort, BenkMeldekortFilter, BenkMeldekortKolonne } from './typer/meldekort';
import { BenkKlagebehandling, BenkKlageFilter, BenkKlageKolonne } from './typer/klage';
import {
    BenkTilbakekreving,
    BenkTilbakekrevingFilter,
    BenkTilbakekrevingKolonne,
} from './typer/tilbakekreving';
import { SøknaderPanel } from './søknader/SøknaderPanel';
import { RevurderingerPanel } from './revurderinger/RevurderingerPanel';
import { MeldekortPanel } from './meldekort/MeldekortPanel';
import { KlagePanel } from './klage/KlagePanel';
import { TilbakekrevingPanel } from './tilbakekreving/TilbakekrevingPanel';

type SøknaderData = {
    oversikt: BenkV2Oversikt<BenkSøknadsbehandling>;
    aktivtFilter: BenkSøknaderFilter;
    aktivSortering: BenkV2Sortering<BenkSøknaderKolonne>;
};

type RevurderingerData = {
    oversikt: BenkV2Oversikt<BenkRevurdering>;
    aktivtFilter: BenkRevurderingerFilter;
    aktivSortering: BenkV2Sortering<BenkRevurderingerKolonne>;
};

type MeldekortData = {
    oversikt: BenkV2Oversikt<BenkMeldekort>;
    aktivtFilter: BenkMeldekortFilter;
    aktivSortering: BenkV2Sortering<BenkMeldekortKolonne>;
};

type KlageData = {
    oversikt: BenkV2Oversikt<BenkKlagebehandling>;
    aktivtFilter: BenkKlageFilter;
    aktivSortering: BenkV2Sortering<BenkKlageKolonne>;
};

type TilbakekrevingData = {
    oversikt: BenkV2Oversikt<BenkTilbakekreving>;
    aktivtFilter: BenkTilbakekrevingFilter;
    aktivSortering: BenkV2Sortering<BenkTilbakekrevingKolonne>;
};

/**
 * Dataene for den aktive fanen. Ligger som ett felt (ikke spredt utover props)
 * slik at diskrimineringen på `tab` bevares gjennom getServerSideProps.
 */
export type BenkV2TabData =
    | { tab: BenkV2Tab.SØKNADER; data: SøknaderData }
    | { tab: BenkV2Tab.REVURDERINGER; data: RevurderingerData }
    | { tab: BenkV2Tab.MELDEKORT; data: MeldekortData }
    | { tab: BenkV2Tab.KLAGE; data: KlageData }
    | { tab: BenkV2Tab.TILBAKEKREVING; data: TilbakekrevingData };

export type BenkSideV2Props = {
    antallPerTab: Record<BenkV2Tab, number>;
    tabData: BenkV2TabData;
};

export const BenkSideV2 = ({ antallPerTab, tabData }: BenkSideV2Props) => {
    const router = useRouter();
    const { tab } = tabData;

    return (
        <VStack gap={'space-20'} padding={'space-16'}>
            <NotificationBanner />

            <Heading size={'medium'} level={'2'}>
                {'Oversikt over åpne behandlinger'}
            </Heading>

            <Tabs
                value={tab}
                onChange={(nyTab) => router.push({ query: { tab: nyTab as BenkV2Tab } })}
            >
                <Tabs.List>
                    {Object.values(BenkV2Tab).map((t) => (
                        <Tabs.Tab
                            key={t}
                            value={t}
                            label={`${benkV2TabTekst[t]} (${antallPerTab[t]})`}
                        />
                    ))}
                </Tabs.List>
            </Tabs>

            {tabData.tab === BenkV2Tab.SØKNADER && (
                <SøknaderPanel
                    oversikt={tabData.data.oversikt}
                    aktivtFilter={tabData.data.aktivtFilter}
                    aktivSortering={tabData.data.aktivSortering}
                />
            )}
            {tabData.tab === BenkV2Tab.REVURDERINGER && (
                <RevurderingerPanel
                    oversikt={tabData.data.oversikt}
                    aktivtFilter={tabData.data.aktivtFilter}
                    aktivSortering={tabData.data.aktivSortering}
                />
            )}
            {tabData.tab === BenkV2Tab.MELDEKORT && (
                <MeldekortPanel
                    oversikt={tabData.data.oversikt}
                    aktivtFilter={tabData.data.aktivtFilter}
                    aktivSortering={tabData.data.aktivSortering}
                />
            )}
            {tabData.tab === BenkV2Tab.KLAGE && (
                <KlagePanel
                    oversikt={tabData.data.oversikt}
                    aktivtFilter={tabData.data.aktivtFilter}
                    aktivSortering={tabData.data.aktivSortering}
                />
            )}
            {tabData.tab === BenkV2Tab.TILBAKEKREVING && (
                <TilbakekrevingPanel
                    oversikt={tabData.data.oversikt}
                    aktivtFilter={tabData.data.aktivtFilter}
                    aktivSortering={tabData.data.aktivSortering}
                />
            )}
        </VStack>
    );
};
