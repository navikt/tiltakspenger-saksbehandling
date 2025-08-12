import { Alert, Button, Heading, HStack, Select, VStack } from '@navikt/ds-react';
import React, { useEffect, useRef, useState } from 'react';
import {
    BehandlingssammendragBenktype,
    BehandlingssammendragStatus,
    BehandlingssammendragType,
    BenkOversiktRequest,
    BenkOversiktResponse,
} from '~/types/Behandlingssammendrag';
import { useRouter } from 'next/router';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { useSearchParams } from 'next/navigation';
import {
    BehandlingssammendragKolonner,
    behandlingsstatusTextFormatter,
    behandlingstypeTextFormatter,
} from './BenkSideUtils';

import styles from './BenkSide.module.css';
import NotificationBanner, {
    NotificationBannerRef,
} from '../notificationBanner/NotificationBanner';
import BenkTabell from '~/components/benk/BenkTabell';

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

    const [type, setType] = useState<BehandlingssammendragType | 'Alle'>(typeParam ?? 'Alle');
    const [benktype, setBenktype] = useState<BehandlingssammendragBenktype>(
        BehandlingssammendragBenktype.KLAR,
    );
    const [status, setStatus] = useState<BehandlingssammendragStatus | 'Alle'>(
        statusParam ?? 'Alle',
    );
    const [saksbehandler, setSaksbehandler] = useState<string | 'Alle' | 'IKKE_TILDELT'>(
        saksbehandlerParam ?? 'Alle',
    );

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
                benktype: benktype,
                behandlingstype: type === 'Alle' ? null : [type],
                status: status === 'Alle' ? null : [status],
                identer: saksbehandler === 'Alle' ? null : [saksbehandler],
                sortering: sorteringRetningParam ?? 'ASC',
            });
            return;
        }
    }, [fetchOversikt, benktype, type, status, saksbehandler, sorteringRetningParam]);

    return (
        <VStack gap="5" style={{ padding: '1rem' }}>
            <NotificationBanner ref={bannerRef} />
            <Heading size="medium" level="2">
                Oversikt over behandlinger og søknader
            </Heading>

            <VStack gap="4">
                <HStack gap="4">
                    <Select
                        label="Benk"
                        size="small"
                        value={benktype as BehandlingssammendragBenktype}
                        onChange={(e) =>
                            setBenktype(e.target.value as unknown as BehandlingssammendragBenktype)
                        }
                    >
                        <option value={BehandlingssammendragBenktype.KLAR}>Klar</option>
                        <option value={BehandlingssammendragBenktype.VENTER}>Venter</option>
                    </Select>
                    <Select
                        label="Type"
                        size="small"
                        value={type}
                        onChange={(e) =>
                            setType(e.target.value as BehandlingssammendragType | 'Alle')
                        }
                    >
                        <option value={'Alle'}>Alle</option>
                        {Object.entries(BehandlingssammendragType).map(([key, value]) => (
                            <option key={key} value={value}>
                                {behandlingstypeTextFormatter[value]}
                            </option>
                        ))}
                    </Select>
                    <Select
                        label="Status"
                        size="small"
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value as BehandlingssammendragStatus | 'Alle')
                        }
                    >
                        <option value={'Alle'}>Alle</option>
                        {Object.values(BehandlingssammendragStatus).map((status) => (
                            <option key={status} value={status}>
                                {behandlingsstatusTextFormatter[status]}
                            </option>
                        ))}
                    </Select>
                    <Select
                        label="Saksbehandler/Beslutter"
                        size="small"
                        value={saksbehandler}
                        onChange={(e) => setSaksbehandler(e.target.value)}
                    >
                        <option value={'Alle'}>Alle</option>
                        <option value={'IKKE_TILDELT'}>Ikke tildelt</option>
                        {benkOversikt.behandlingssammendrag
                            .map((behandling) => behandling.saksbehandler)
                            .filter((value, index, self) => value && self.indexOf(value) === index)
                            .map((saksbehandler) => (
                                <option key={saksbehandler} value={saksbehandler!}>
                                    {innloggetSaksbehandler.navIdent === saksbehandler
                                        ? 'Meg'
                                        : saksbehandler}
                                </option>
                            ))}
                    </Select>
                </HStack>
                <HStack gap="4">
                    <Button
                        type="button"
                        size="small"
                        onClick={() => {
                            const query = new URLSearchParams(searchParams.toString());

                            if (benktype) {
                                query.set('benktype', benktype);
                            }
                            if (type !== 'Alle') {
                                query.set('type', type);
                            } else {
                                query.delete('type');
                            }
                            if (status !== 'Alle') {
                                query.set('status', status);
                            } else {
                                query.delete('status');
                            }
                            if (saksbehandler !== 'Alle') {
                                query.set('saksbehandler', saksbehandler);
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
                                benktype: benktype,
                                behandlingstype: type === 'Alle' ? null : [type],
                                status: status === 'Alle' ? null : [status],
                                identer: saksbehandler === 'Alle' ? null : [saksbehandler],
                                sortering: sorteringRetningParam ?? 'ASC',
                            });
                        }}
                    >
                        Oppdater filtre
                    </Button>
                    <Button
                        type="button"
                        size="small"
                        variant="secondary"
                        onClick={() => {
                            setBenktype(BehandlingssammendragBenktype.KLAR);
                            setType('Alle');
                            setStatus('Alle');
                            setSaksbehandler('Alle');

                            router.push({ pathname: router.pathname });
                            fetchOversikt.trigger({
                                benktype: BehandlingssammendragBenktype.KLAR,
                                behandlingstype: null,
                                status: null,
                                identer: null,
                                sortering: 'ASC',
                            });
                        }}
                    >
                        Nullstill filtre
                    </Button>
                </HStack>
            </VStack>
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
                        benktype,
                        behandlingstype: type === 'Alle' ? null : [type],
                        status: status === 'Alle' ? null : [status],
                        identer: saksbehandler === 'Alle' ? null : [saksbehandler],
                        sortering: erDefaultSortering
                            ? `${BehandlingssammendragKolonner.startet},ASC`
                            : sortering,
                    });
                }}
            />
        </VStack>
    );
};
