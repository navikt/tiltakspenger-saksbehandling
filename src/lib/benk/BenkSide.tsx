import { BodyShort, Heading, HStack, Loader, Tabs, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NotificationBanner from '~/lib/_felles/notifications/NotificationBanner';
import { BenkTab, benkTabTekst } from './typer/tabs';
import { BenkSideProps } from './typer/benkside';
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
import { Infokort } from '~/lib/_felles/infokort/Infokort';

import style from './BenkSide.module.css';

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

            <BenkVisningProvider tabData={tabData}>
                {tabData.tab === BenkTab.SØKNADER && (
                    <BenkPanel
                        laster={laster}
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
                        laster={laster}
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
                        laster={laster}
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
                        laster={laster}
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
                        laster={laster}
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
