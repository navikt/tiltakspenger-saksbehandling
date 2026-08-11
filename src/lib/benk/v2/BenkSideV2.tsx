import { Heading, Tabs, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { Nullable } from '~/types/UtilTypes';
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
import { BenkSøknaderFilterSkjema } from './søknader/BenkSøknaderFilterSkjema';
import { BenkSøknaderTabell } from './søknader/BenkSøknaderTabell';
import { BenkRevurderingerFilterSkjema } from './revurderinger/BenkRevurderingerFilterSkjema';
import { BenkRevurderingerTabell } from './revurderinger/BenkRevurderingerTabell';
import { BenkMeldekortFilterSkjema } from './meldekort/BenkMeldekortFilterSkjema';
import { BenkMeldekortTabell } from './meldekort/BenkMeldekortTabell';
import { BenkKlageFilterSkjema } from './klage/BenkKlageFilterSkjema';
import { BenkKlageTabell } from './klage/BenkKlageTabell';
import { BenkTilbakekrevingFilterSkjema } from './tilbakekreving/BenkTilbakekrevingFilterSkjema';
import { BenkTilbakekrevingTabell } from './tilbakekreving/BenkTilbakekrevingTabell';
import { BenkPanel } from './felles/BenkPanel';
import { BenkVisningProvider } from './felles/BenkVisningContext';
import { Infokort } from '~/lib/_felles/infokort/Infokort';

import style from './BenkSideV2.module.css';

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
type BenkV2TabData =
    | { tab: BenkV2Tab.SØKNADER; data: SøknaderData }
    | { tab: BenkV2Tab.REVURDERINGER; data: RevurderingerData }
    | { tab: BenkV2Tab.MELDEKORT; data: MeldekortData }
    | { tab: BenkV2Tab.KLAGE; data: KlageData }
    | { tab: BenkV2Tab.TILBAKEKREVING; data: TilbakekrevingData };

export type BenkSideV2Props = {
    antallPerTab: Record<BenkV2Tab, number>;
    tabData: BenkV2TabData;
    /** Satt når backend ikke kunne tolke requesten og svarte med en standardvisning */
    error: Nullable<string>;
};

export const BenkSideV2 = ({ antallPerTab, tabData, error }: BenkSideV2Props) => {
    const router = useRouter();
    const { tab } = tabData;

    return (
        <VStack gap={'space-20'} padding={'space-16'}>
            <NotificationBanner />

            <Heading size={'medium'} level={'2'}>
                {'Oversikt over åpne behandlinger'}
            </Heading>

            {/* Fjern denne etter en viss tid */}
            <Infokort variant={'info'} size={'small'} className={style.varsel}>
                {'Benken er nå delt inn i faner med tabeller tilpasset behandlingstypene. ' +
                    'Du kan åpne behandlingene eller utføre handlinger direkte fra benken med knappene til høyre i tabellene. ' +
                    'Klikk på fødselsnummeret for å gå til personoversikten.'}
            </Infokort>

            {error && (
                <Infokort variant={'feil'} header={'Feil i filtreringen'} className={style.varsel}>
                    {error}
                </Infokort>
            )}

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

            <BenkVisningProvider skjulVentestatus={tabData.data.aktivtFilter.skjulPåVent}>
                {tabData.tab === BenkV2Tab.SØKNADER && (
                    <BenkPanel
                        oversikt={tabData.data.oversikt}
                        filter={
                            <BenkSøknaderFilterSkjema
                                behandlinger={tabData.data.oversikt.behandlinger}
                                aktivtFilter={tabData.data.aktivtFilter}
                            />
                        }
                        tabell={
                            <BenkSøknaderTabell
                                behandlinger={tabData.data.oversikt.behandlinger}
                                aktivSortering={tabData.data.aktivSortering}
                            />
                        }
                    />
                )}
                {tabData.tab === BenkV2Tab.REVURDERINGER && (
                    <BenkPanel
                        oversikt={tabData.data.oversikt}
                        filter={
                            <BenkRevurderingerFilterSkjema
                                behandlinger={tabData.data.oversikt.behandlinger}
                                aktivtFilter={tabData.data.aktivtFilter}
                            />
                        }
                        tabell={
                            <BenkRevurderingerTabell
                                behandlinger={tabData.data.oversikt.behandlinger}
                                aktivSortering={tabData.data.aktivSortering}
                            />
                        }
                    />
                )}
                {tabData.tab === BenkV2Tab.MELDEKORT && (
                    <BenkPanel
                        oversikt={tabData.data.oversikt}
                        filter={
                            <BenkMeldekortFilterSkjema
                                behandlinger={tabData.data.oversikt.behandlinger}
                                aktivtFilter={tabData.data.aktivtFilter}
                            />
                        }
                        tabell={
                            <BenkMeldekortTabell
                                behandlinger={tabData.data.oversikt.behandlinger}
                                aktivSortering={tabData.data.aktivSortering}
                            />
                        }
                    />
                )}
                {tabData.tab === BenkV2Tab.KLAGE && (
                    <BenkPanel
                        oversikt={tabData.data.oversikt}
                        filter={
                            <BenkKlageFilterSkjema
                                behandlinger={tabData.data.oversikt.behandlinger}
                                aktivtFilter={tabData.data.aktivtFilter}
                            />
                        }
                        tabell={
                            <BenkKlageTabell
                                behandlinger={tabData.data.oversikt.behandlinger}
                                aktivSortering={tabData.data.aktivSortering}
                            />
                        }
                    />
                )}
                {tabData.tab === BenkV2Tab.TILBAKEKREVING && (
                    <BenkPanel
                        oversikt={tabData.data.oversikt}
                        filter={
                            <BenkTilbakekrevingFilterSkjema
                                behandlinger={tabData.data.oversikt.behandlinger}
                                aktivtFilter={tabData.data.aktivtFilter}
                            />
                        }
                        tabell={
                            <BenkTilbakekrevingTabell
                                behandlinger={tabData.data.oversikt.behandlinger}
                                aktivSortering={tabData.data.aktivSortering}
                            />
                        }
                    />
                )}
            </BenkVisningProvider>
        </VStack>
    );
};
