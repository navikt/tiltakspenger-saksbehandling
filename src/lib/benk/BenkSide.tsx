import { BodyShort, Heading, HStack, Loader, Tabs, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Nullable } from '~/types/UtilTypes';
import NotificationBanner from '~/lib/_felles/notifications/NotificationBanner';
import { BenkOversikt, BenkSortering } from './typer/felles';
import { BenkTab, benkTabTekst } from './typer/tabs';
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

import style from './BenkSide.module.css';

type SøknaderData = {
    oversikt: BenkOversikt<BenkSøknadsbehandling>;
    aktivtFilter: BenkSøknaderFilter;
    aktivSortering: BenkSortering<BenkSøknaderKolonne>;
};

type RevurderingerData = {
    oversikt: BenkOversikt<BenkRevurdering>;
    aktivtFilter: BenkRevurderingerFilter;
    aktivSortering: BenkSortering<BenkRevurderingerKolonne>;
};

type MeldekortData = {
    oversikt: BenkOversikt<BenkMeldekort>;
    aktivtFilter: BenkMeldekortFilter;
    aktivSortering: BenkSortering<BenkMeldekortKolonne>;
};

type KlageData = {
    oversikt: BenkOversikt<BenkKlagebehandling>;
    aktivtFilter: BenkKlageFilter;
    aktivSortering: BenkSortering<BenkKlageKolonne>;
};

type TilbakekrevingData = {
    oversikt: BenkOversikt<BenkTilbakekreving>;
    aktivtFilter: BenkTilbakekrevingFilter;
    aktivSortering: BenkSortering<BenkTilbakekrevingKolonne>;
};

/**
 * Dataene for den aktive fanen. Ligger som ett felt (ikke spredt utover props)
 * slik at diskrimineringen på `tab` bevares gjennom getServerSideProps.
 */
type BenkTabData =
    | { tab: BenkTab.SØKNADER; data: SøknaderData }
    | { tab: BenkTab.REVURDERINGER; data: RevurderingerData }
    | { tab: BenkTab.MELDEKORT; data: MeldekortData }
    | { tab: BenkTab.KLAGE; data: KlageData }
    | { tab: BenkTab.TILBAKEKREVING; data: TilbakekrevingData };

export type BenkSideProps = {
    antallPerTab: Record<BenkTab, number>;
    tabData: BenkTabData;
    /** Satt når backend ikke kunne tolke requesten og svarte med en standardvisning */
    error: Nullable<string>;
};

export const BenkSide = ({ antallPerTab, tabData, error }: BenkSideProps) => {
    const router = useRouter();
    const { tab } = tabData;
    const [laster, setLaster] = useState(false);

    // Loaderen nullstilles når navigasjonen er ferdig (eller feiler)
    useEffect(() => {
        const nullstillLaster = () => setLaster(false);
        router.events.on('routeChangeComplete', nullstillLaster);
        router.events.on('routeChangeError', nullstillLaster);
        return () => {
            router.events.off('routeChangeComplete', nullstillLaster);
            router.events.off('routeChangeError', nullstillLaster);
        };
    }, [router.events]);

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
                onChange={(nyTab) => {
                    if (nyTab !== tab) {
                        setLaster(true);
                    }
                    router.push({ query: { tab: nyTab as BenkTab } });
                }}
            >
                <Tabs.List>
                    {Object.values(BenkTab).map((t) => (
                        <Tabs.Tab
                            key={t}
                            value={t}
                            label={`${benkTabTekst[t]} (${antallPerTab[t]})`}
                        />
                    ))}

                    {laster && (
                        <HStack
                            gap={'space-8'}
                            align={'center'}
                            wrap={false}
                            className={style.loader}
                        >
                            <Loader size={'medium'} title={'Laster...'} variant={'interaction'} />
                            <BodyShort>{'Laster...'}</BodyShort>
                        </HStack>
                    )}
                </Tabs.List>
            </Tabs>

            <BenkVisningProvider skjulVentestatus={tabData.data.aktivtFilter.skjulPåVent}>
                {tabData.tab === BenkTab.SØKNADER && (
                    <BenkPanel
                        oversikt={tabData.data.oversikt}
                        filter={
                            <BenkSøknaderFilterSkjema
                                saksbehandlere={tabData.data.oversikt.saksbehandlere}
                                besluttere={tabData.data.oversikt.besluttere}
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
                {tabData.tab === BenkTab.REVURDERINGER && (
                    <BenkPanel
                        oversikt={tabData.data.oversikt}
                        filter={
                            <BenkRevurderingerFilterSkjema
                                saksbehandlere={tabData.data.oversikt.saksbehandlere}
                                besluttere={tabData.data.oversikt.besluttere}
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
                {tabData.tab === BenkTab.MELDEKORT && (
                    <BenkPanel
                        oversikt={tabData.data.oversikt}
                        filter={
                            <BenkMeldekortFilterSkjema
                                saksbehandlere={tabData.data.oversikt.saksbehandlere}
                                besluttere={tabData.data.oversikt.besluttere}
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
                {tabData.tab === BenkTab.KLAGE && (
                    <BenkPanel
                        oversikt={tabData.data.oversikt}
                        filter={
                            <BenkKlageFilterSkjema
                                saksbehandlere={tabData.data.oversikt.saksbehandlere}
                                besluttere={tabData.data.oversikt.besluttere}
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
                {tabData.tab === BenkTab.TILBAKEKREVING && (
                    <BenkPanel
                        oversikt={tabData.data.oversikt}
                        filter={
                            <BenkTilbakekrevingFilterSkjema
                                saksbehandlere={tabData.data.oversikt.saksbehandlere}
                                besluttere={tabData.data.oversikt.besluttere}
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
