import React, { useEffect, useRef, useState } from 'react';
import { Alert, BodyShort, Heading, HStack, LocalAlert, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { useSearchParams } from 'next/navigation';
import NotificationBanner, {
    NotificationBannerRef,
} from '../notificationBanner/NotificationBanner';
import { BenkTabell } from '~/components/benk/tabell/BenkTabell';
import { BenkFilter } from '~/components/benk/filter/BenkFilter';
import {
    BehandlingssammendragBenktype,
    BenkBehandlingsstatus,
    BenkBehandlingstype,
    BenkKolonne,
    BenkOversiktRequest,
    BenkOversiktResponse,
    BenkSortering,
    BenkSorteringRetning,
} from '~/types/Benk';
import { BenkFiltreringContext } from '~/context/BenkFiltreringContext';

import styles from './BenkSide.module.css';
import { Nullable } from '~/types/UtilTypes';

export type BenkFilters = {
    benktype: BehandlingssammendragBenktype | 'Alle';
    type: BenkBehandlingstype | 'Alle';
    status: BenkBehandlingsstatus | 'Alle';
    saksbehandler: string | 'Alle' | 'IKKE_TILDELT';
};

type Props = {
    benkOversikt: BenkOversiktResponse;
};

export const BenkOversiktSide = ({ benkOversikt }: Props) => {
    const router = useRouter();
    const firstLoadRef = useRef(true);
    const searchParams = useSearchParams();
    const bannerRef = useRef<NotificationBannerRef>(null);
    const { innloggetSaksbehandler } = useSaksbehandler();
    const { filters, setFilters } = React.useContext(BenkFiltreringContext);

    const benktypeParam = searchParams.get('benktype') as BehandlingssammendragBenktype | null;
    const typeParam = searchParams.get('type') as BenkBehandlingstype | null;
    const statusParam = searchParams.get('status') as BenkBehandlingsstatus | null;
    const saksbehandlerParam = searchParams.get('saksbehandler') as string | null;
    const sorteringRetningParam = searchParams.get('sortering') as Nullable<BenkSorteringRetning>;

    const [filtrertBenkoversikt, setFiltrertBenkoversikt] =
        useState<BenkOversiktResponse>(benkOversikt);

    const fetchOversikt = useFetchJsonFraApi<BenkOversiktResponse, BenkOversiktRequest>(
        `/behandlinger`,
        'POST',
        {
            onSuccess: (oversikt) => setFiltrertBenkoversikt(oversikt!),
        },
    );

    const { behandlingssammendrag, antallFiltrertPgaTilgang } = filtrertBenkoversikt;

    useEffect(() => {
        firstLoadRef.current = false;
        fetchOversikt.trigger({
            benktype: benktypeParam ? [benktypeParam] : null,
            behandlingstype: typeParam ? [typeParam] : null,
            status: statusParam ? [statusParam] : null,
            identer: saksbehandlerParam ? [saksbehandlerParam] : null,
            sortering: sorteringRetningParam ?? 'ASC',
        });

        setFilters({
            benktype: benktypeParam ?? filters.benktype,
            type: typeParam ?? filters.type,
            status: statusParam ?? filters.status,
            saksbehandler: saksbehandlerParam ?? filters.saksbehandler,
        });

        updateUrlWithSelectedFilters();
        //ønsker kun å kjøre denne effekten på første innlastning
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [benktypeParam, typeParam, statusParam, saksbehandlerParam, sorteringRetningParam]);

    const updateUrlWithSelectedFilters = () => {
        const query = new URLSearchParams(searchParams.toString());
        if (filters.benktype !== 'Alle') {
            query.set('benktype', filters.benktype);
        } else {
            query.delete('benktype');
        }
        if (filters.type !== 'Alle') {
            query.set('type', filters.type);
        } else {
            query.delete('type');
        }
        if (filters.status !== 'Alle') {
            query.set('status', filters.status);
        } else {
            query.delete('status');
        }
        if (filters.saksbehandler !== 'Alle') {
            query.set('saksbehandler', filters.saksbehandler);
        } else {
            query.delete('saksbehandler');
        }
        if (sorteringRetningParam) {
            query.set('sortering', sorteringRetningParam);
        } else {
            query.delete('sortering');
        }

        router.push({ pathname: router.pathname, search: query.toString() });
    };

    const handleOppdaterFilter = () => {
        updateUrlWithSelectedFilters();
        bannerRef.current?.clearMessage();
        fetchOversikt.trigger({
            benktype: filters.benktype === 'Alle' ? null : [filters.benktype],
            behandlingstype: filters.type === 'Alle' ? null : [filters.type],
            status: filters.status === 'Alle' ? null : [filters.status],
            identer: filters.saksbehandler === 'Alle' ? null : [filters.saksbehandler],
            sortering: sorteringRetningParam ?? 'ASC',
        });
    };

    const handleNullstillFilter = () => {
        setFilters({
            benktype: 'Alle',
            type: 'Alle',
            status: 'Alle',
            saksbehandler: 'Alle',
        });
        router.push({ pathname: router.pathname });

        fetchOversikt.trigger({
            benktype: null,
            behandlingstype: null,
            status: null,
            identer: null,
            sortering: 'ASC',
        });
    };

    return (
        <VStack gap="space-20" style={{ padding: '1rem' }}>
            <NotificationBanner ref={bannerRef} />

            <Heading size="medium" level="2">
                Oversikt over behandlinger og søknader
            </Heading>

            <BenkFilter
                filters={filters}
                setFilters={setFilters}
                benkOversikt={benkOversikt}
                innloggetSaksbehandler={innloggetSaksbehandler}
                onOppdaterFilter={handleOppdaterFilter}
                onNullstillFilter={handleNullstillFilter}
                oppdaterFilterLoading={fetchOversikt.isMutating && !firstLoadRef.current}
            />

            {benkOversikt.totalAntall > 500 && (
                <div className={styles.høytAntallBehandlingerContainer}>
                    <Alert variant="warning" size="small">
                        Det finnes et høyt antall behandlinger på benken. Oversikten er begrenset,
                        og vil ikke vise alle behandlinger. Totalt antall behandlinger:{' '}
                        {benkOversikt.totalAntall}.
                    </Alert>
                </div>
            )}

            {fetchOversikt.error && (
                <LocalAlert status="error" size="small" className={styles.fetchOversiktErrorAlert}>
                    <LocalAlert.Header>
                        <LocalAlert.Title>Feil ved filtering av benken</LocalAlert.Title>
                    </LocalAlert.Header>
                    <LocalAlert.Content>{fetchOversikt.error.message}</LocalAlert.Content>
                </LocalAlert>
            )}

            <HStack gap={'space-16'}>
                <BodyShort>{`Antall behandlinger: ${behandlingssammendrag.length}`}</BodyShort>
                {antallFiltrertPgaTilgang > 0 && (
                    <BodyShort>
                        {`Antall behandlinger filtrert vekk pga tilgang: ${antallFiltrertPgaTilgang}`}
                    </BodyShort>
                )}
            </HStack>

            <BenkTabell
                behandlinger={filtrertBenkoversikt.behandlingssammendrag}
                sorteringRetningInitial={sorteringRetningParam ?? 'ASC'}
                onSortChange={(kolonne, sorteringRetning) => {
                    const sortering: BenkSortering = `${kolonne},${sorteringRetning}`;

                    const erDefaultSortering = sortering === `${BenkKolonne.startet},ASC`;

                    const currentParams = new URLSearchParams(searchParams.toString());

                    if (erDefaultSortering) {
                        currentParams.delete('sortering');
                    } else {
                        currentParams.set('sortering', sortering);
                    }

                    router.push({
                        pathname: router.pathname,
                        search: currentParams.toString(),
                    });

                    fetchOversikt.trigger({
                        benktype: filters.benktype === 'Alle' ? null : [filters.benktype],
                        behandlingstype: filters.type === 'Alle' ? null : [filters.type],
                        status: filters.status === 'Alle' ? null : [filters.status],
                        identer: filters.saksbehandler === 'Alle' ? null : [filters.saksbehandler],
                        sortering: sortering,
                    });
                }}
            />
        </VStack>
    );
};
