import { useEffect, useMemo, useState } from 'react';
import { Button, HStack, Select, VStack } from '@navikt/ds-react';
import {
    BenkBehandlingKlarEllerVenter,
    BenkBehandlingsstatus,
    BenkBehandlingstype,
    BenkFilters,
    BenkOversiktResponse,
} from '~/types/Benk';
import {
    benkBehandlingsstatusTekst,
    benkBehandlingstypeTekst,
} from '~/components/benk/benkSideUtils';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';
import { useRouter } from 'next/router';
import {
    benkFiltersFraSearchParams,
    benkFiltersTilQueryParams,
    clearBenkFilterCookie,
    hentSaksbehandlereTilFiltrering,
    queryUtenBenkFilter,
    setBenkFilterCookie,
} from '~/components/benk/filter/benkFilterUtils';
import { useSearchParams } from 'next/navigation';

type Props = {
    benkOversikt: BenkOversiktResponse;
    onUpdateFilter: (filter: BenkFilters) => void;
};

export const BenkFilterVelger = ({ benkOversikt, onUpdateFilter }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const aktivtFilter = useMemo(() => benkFiltersFraSearchParams(searchParams), [searchParams]);

    const [valgtFilter, setValgtFilter] = useState<BenkFilters>(aktivtFilter);

    const oppdaterValgtFilter = (oppdatering: Partial<BenkFilters>) => {
        setValgtFilter({
            ...valgtFilter,
            ...oppdatering,
        });
    };

    const { innloggetSaksbehandler } = useSaksbehandler();

    const saksbehandlere = useMemo(
        () =>
            hentSaksbehandlereTilFiltrering(
                benkOversikt.behandlingssammendrag,
                innloggetSaksbehandler,
            ),
        [benkOversikt.behandlingssammendrag, innloggetSaksbehandler],
    );

    useEffect(() => {
        setValgtFilter(aktivtFilter);
    }, [aktivtFilter]);

    return (
        <VStack gap="space-16">
            <HStack gap="space-16">
                <Select
                    label={'Benk'}
                    size={'small'}
                    value={valgtFilter.benktype ?? ''}
                    onChange={(e) =>
                        oppdaterValgtFilter({
                            benktype: (e.target.value as BenkBehandlingKlarEllerVenter) || null,
                        })
                    }
                >
                    <option value={''}>{'Alle'}</option>
                    <option value={BenkBehandlingKlarEllerVenter.KLAR}>{'Klar'}</option>
                    <option value={BenkBehandlingKlarEllerVenter.VENTER}>{'Venter'}</option>
                </Select>

                <Select
                    label={'Type'}
                    size={'small'}
                    value={valgtFilter.type ?? ''}
                    onChange={(e) =>
                        oppdaterValgtFilter({
                            type: (e.target.value as BenkBehandlingstype) || null,
                        })
                    }
                >
                    <option value={''}>{'Alle'}</option>
                    {Object.values(BenkBehandlingstype).map((behandlingstype) => (
                        <option key={behandlingstype} value={behandlingstype}>
                            {benkBehandlingstypeTekst[behandlingstype]}
                        </option>
                    ))}
                </Select>

                <Select
                    label={'Status'}
                    size={'small'}
                    value={valgtFilter.status ?? ''}
                    onChange={(e) =>
                        oppdaterValgtFilter({
                            status: (e.target.value as BenkBehandlingsstatus) || null,
                        })
                    }
                >
                    <option value={''}>{'Alle'}</option>
                    {Object.values(BenkBehandlingsstatus).map((status) => (
                        <option key={status} value={status}>
                            {benkBehandlingsstatusTekst[status]}
                        </option>
                    ))}
                </Select>

                <Select
                    label={'Saksbehandler/Beslutter'}
                    size={'small'}
                    value={valgtFilter.saksbehandler ?? ''}
                    onChange={(e) =>
                        oppdaterValgtFilter({
                            saksbehandler: e.target.value || null,
                        })
                    }
                >
                    <option value={''}>{'Alle'}</option>
                    <option value={'IKKE_TILDELT'}>{'Ikke tildelt'}</option>
                    {saksbehandlere.map((saksbehandlerEllerBeslutter) => (
                        <option
                            key={saksbehandlerEllerBeslutter}
                            value={saksbehandlerEllerBeslutter!}
                        >
                            {innloggetSaksbehandler.navIdent === saksbehandlerEllerBeslutter
                                ? 'Meg'
                                : saksbehandlerEllerBeslutter}
                        </option>
                    ))}
                </Select>
            </HStack>

            <HStack gap={'space-16'}>
                <Button
                    type={'button'}
                    size={'small'}
                    onClick={() => {
                        setBenkFilterCookie(valgtFilter);
                        onUpdateFilter(valgtFilter);

                        router.push({
                            query: {
                                ...queryUtenBenkFilter(router.query),
                                ...benkFiltersTilQueryParams(valgtFilter),
                            },
                        });
                    }}
                >
                    {'Oppdater filtre'}
                </Button>

                <Button
                    type={'button'}
                    size={'small'}
                    variant={'secondary'}
                    onClick={() => {
                        clearBenkFilterCookie();
                        onUpdateFilter(valgtFilter);

                        router.push({ query: queryUtenBenkFilter(router.query) });
                    }}
                >
                    {'Nullstill filtre'}
                </Button>
            </HStack>
        </VStack>
    );
};
