import React, { useEffect, useRef, useState } from 'react';
import { Alert, Heading, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { useSearchParams } from 'next/navigation';
import NotificationBanner, {
    NotificationBannerRef,
} from '../notificationBanner/NotificationBanner';
import BenkTabell from '~/components/benk/BenkTabell';
import BenkFilter from '~/components/benk/BenkFilter';
import {
    BehandlingssammendragBenktype,
    BehandlingssammendragStatus,
    BehandlingssammendragType,
    BenkOversiktRequest,
    BenkOversiktResponse,
} from '~/types/Behandlingssammendrag';
import { BehandlingssammendragKolonner } from './BenkSideUtils';
import styles from './BenkSide.module.css';

type Filters = {
    benktype: BehandlingssammendragBenktype;
    type: BehandlingssammendragType | 'Alle';
    status: BehandlingssammendragStatus | 'Alle';
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

    const typeParam = searchParams.get('type') as BehandlingssammendragType | null;
    const statusParam = searchParams.get('status') as BehandlingssammendragStatus | null;
    const saksbehandlerParam = searchParams.get('saksbehandler') as string | null;
    const sorteringRetningParam = searchParams.get('sortering') as 'ASC' | 'DESC' | null;

    const [filters, setFilters] = useState<Filters>({
        benktype: BehandlingssammendragBenktype.KLAR,
        type: typeParam ?? 'Alle',
        status: statusParam ?? 'Alle',
        saksbehandler: saksbehandlerParam ?? 'Alle',
    });

    const [filtrertBenkoversikt, setFiltrertBenkoversikt] =
        useState<BenkOversiktResponse>(benkOversikt);

    const fetchOversikt = useFetchJsonFraApi<BenkOversiktResponse, BenkOversiktRequest>(
        `/behandlinger`,
        'POST',
        {
            onSuccess: (oversikt) => setFiltrertBenkoversikt(oversikt!),
        },
    );

    useEffect(() => {
        if (firstLoadRef.current) {
            firstLoadRef.current = false;
            fetchOversikt.trigger({
                benktype: filters.benktype,
                behandlingstype: filters.type === 'Alle' ? null : [filters.type],
                status: filters.status === 'Alle' ? null : [filters.status],
                identer: filters.saksbehandler === 'Alle' ? null : [filters.saksbehandler],
                sortering: sorteringRetningParam ?? 'ASC',
            });
            return;
        }
    }, [fetchOversikt, filters, sorteringRetningParam]);

    const handleOppdaterFilter = () => {
        const query = new URLSearchParams(searchParams.toString());
        if (filters.benktype) {
            query.set('benktype', filters.benktype);
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
        bannerRef.current?.clearMessage();
        fetchOversikt.trigger({
            benktype: filters.benktype,
            behandlingstype: filters.type === 'Alle' ? null : [filters.type],
            status: filters.status === 'Alle' ? null : [filters.status],
            identer: filters.saksbehandler === 'Alle' ? null : [filters.saksbehandler],
            sortering: sorteringRetningParam ?? 'ASC',
        });
    };

    const handleNullstillFilter = () => {
        setFilters({
            benktype: BehandlingssammendragBenktype.KLAR,
            type: 'Alle',
            status: 'Alle',
            saksbehandler: 'Alle',
        });
        router.push({ pathname: router.pathname });
        fetchOversikt.trigger({
            benktype: BehandlingssammendragBenktype.KLAR,
            behandlingstype: null,
            status: null,
            identer: null,
            sortering: 'ASC',
        });
    };

    return (
        <VStack gap="5" style={{ padding: '1rem' }}>
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
            />
            {benkOversikt.totalAntall > 500 && (
                <div className={styles.høytAntallBehandlingerContainer}>
                    <Alert variant="warning" size="small">
                        Det finnes et høyt antall behandlinger på benken. Oversikten er begrenset,
                        og vil ikke vise alle behandlinger.
                    </Alert>
                </div>
            )}
            <BenkTabell
                data={filtrertBenkoversikt}
                sorteringRetning={sorteringRetningParam ?? 'ASC'}
                onSortChange={(kolonne, sorteringRetning) => {
                    const sortering = `${kolonne},${sorteringRetning}`;
                    const erDefaultSortering =
                        kolonne === BehandlingssammendragKolonner.startet &&
                        sorteringRetning === 'ASC';

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
                        benktype: filters.benktype,
                        behandlingstype: filters.type === 'Alle' ? null : [filters.type],
                        status: filters.status === 'Alle' ? null : [filters.status],
                        identer: filters.saksbehandler === 'Alle' ? null : [filters.saksbehandler],
                        sortering: erDefaultSortering
                            ? `${BehandlingssammendragKolonner.startet},ASC`
                            : sortering,
                    });
                }}
            />
        </VStack>
    );
};
