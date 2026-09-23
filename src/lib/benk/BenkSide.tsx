import { BodyShort, Heading, HStack, Loader, Tabs, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { ComponentType, useEffect, useState } from 'react';
import NotificationBanner from '~/lib/_felles/notifications/NotificationBanner';
import { BenkTab } from './typer/tabs';
import { BenkFaneData, BenkSideProps } from './typer/benkside';
import { benkFaner } from './benkFaner';
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
import { BenkVisningProvider } from './felles/filter/BenkVisningContext';
import { BenkFaneFilterSkjemaProps } from './felles/filter/BenkFilterSkjema';
import { BenkFaneTabellProps } from './felles/tabell/BenkTabell';
import { Infokort } from '~/lib/_felles/infokort/Infokort';

import style from './BenkSide.module.css';

type BenkFaneKomponenter<T extends BenkTab> = {
    Filter: ComponentType<BenkFaneFilterSkjemaProps<T>>;
    Tabell: ComponentType<BenkFaneTabellProps<T>>;
};

const benkFaneKomponenter: { [T in BenkTab]: BenkFaneKomponenter<T> } = {
    [BenkTab.SØKNADER]: { Filter: BenkSøknaderFilterSkjema, Tabell: BenkSøknaderTabell },
    [BenkTab.REVURDERINGER]: {
        Filter: BenkRevurderingerFilterSkjema,
        Tabell: BenkRevurderingerTabell,
    },
    [BenkTab.MELDEKORT]: { Filter: BenkMeldekortFilterSkjema, Tabell: BenkMeldekortTabell },
    [BenkTab.KLAGE]: { Filter: BenkKlageFilterSkjema, Tabell: BenkKlageTabell },
    [BenkTab.TILBAKEKREVING]: {
        Filter: BenkTilbakekrevingFilterSkjema,
        Tabell: BenkTilbakekrevingTabell,
    },
};

export const BenkSide = ({ antallPerTab, tabData, error }: BenkSideProps) => {
    const router = useRouter();
    const { tab } = tabData;
    const [laster, setLaster] = useState(false);

    // Loaderen nullstilles når navigasjonen er ferdig (eller feiler)
    useEffect(() => {
        const nullstillLaster = () => setLaster(false);
        const oppdaterLaster = (pathname: string) => {
            const url = new URL(pathname, window.location.origin);

            if (url.pathname === '/') {
                setLaster(true);
            }
        };

        router.events.on('routeChangeComplete', nullstillLaster);
        router.events.on('routeChangeError', nullstillLaster);
        router.events.on('routeChangeStart', oppdaterLaster);

        return () => {
            router.events.off('routeChangeComplete', nullstillLaster);
            router.events.off('routeChangeError', nullstillLaster);
            router.events.off('routeChangeStart', oppdaterLaster);
        };
    }, [router.events]);

    return (
        <VStack gap={'space-20'} padding={'space-16'}>
            <NotificationBanner />

            <Heading size={'medium'} level={'2'}>
                {'Oversikt over åpne behandlinger'}
            </Heading>

            {error && (
                <Infokort variant={'feil'} header={'Feil i filtreringen'} className={style.varsel}>
                    {error}
                </Infokort>
            )}

            <Tabs
                value={tab}
                onChange={(nyTab) => {
                    router.push({ query: { tab: nyTab as BenkTab } });
                }}
            >
                <Tabs.List>
                    {Object.values(BenkTab).map((t) => (
                        <Tabs.Tab
                            key={t}
                            value={t}
                            label={`${benkFaner[t].tekst} (${antallPerTab[t]})`}
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

            <BenkVisningProvider tabData={tabData}>
                <BenkFane tab={tabData.tab} data={tabData.data} laster={laster} />
            </BenkVisningProvider>
        </VStack>
    );
};

const BenkFane = <T extends BenkTab>({
    tab,
    data,
    laster,
}: {
    tab: T;
    data: BenkFaneData<T>;
    laster: boolean;
}) => {
    const { Filter, Tabell } = benkFaneKomponenter[tab];
    const { oversikt, aktivtFilter, aktivSortering } = data;

    return (
        <BenkPanel
            laster={laster}
            oversikt={oversikt}
            filter={
                <Filter
                    aktivtFilter={aktivtFilter}
                    saksbehandlere={oversikt.saksbehandlere}
                    besluttere={oversikt.besluttere}
                />
            }
            tabell={<Tabell behandlinger={oversikt.behandlinger} aktivSortering={aktivSortering} />}
        />
    );
};
