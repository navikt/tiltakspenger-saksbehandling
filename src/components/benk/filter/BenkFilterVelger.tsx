import { useEffect, useMemo, useState } from 'react';
import { Button, HStack, Select, VStack } from '@navikt/ds-react';
import {
    BehandlingssammendragBenktype,
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
import { useBenkFilter } from '~/components/benk/filter/BenkFilterContext';
import router from 'next/router';
import {
    benkFiltersTilQueryParams,
    hentSaksbehandlereTilFiltrering,
    queryUtenBenkFilter,
} from '~/components/benk/filter/benkFilterUtils';

type Props = {
    benkOversikt: BenkOversiktResponse;
};

export const BenkFilterVelger = ({ benkOversikt }: Props) => {
    const { filters } = useBenkFilter();

    const [valgtFilter, setValgtFilter] = useState<BenkFilters>(filters);

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
        setValgtFilter(filters);
    }, [filters]);

    return (
        <VStack gap="space-16">
            <HStack gap="space-16">
                <Select
                    label={'Benk'}
                    size={'small'}
                    value={valgtFilter.benktype ?? ''}
                    onChange={(e) =>
                        oppdaterValgtFilter({
                            benktype: (e.target.value as BehandlingssammendragBenktype) || null,
                        })
                    }
                >
                    <option value={''}>{'Alle'}</option>
                    <option value={BehandlingssammendragBenktype.KLAR}>{'Klar'}</option>
                    <option value={BehandlingssammendragBenktype.VENTER}>{'Venter'}</option>
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
                        const query = queryUtenBenkFilter(router.query);
                        router.push({
                            query: {
                                ...query,
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
                        const query = queryUtenBenkFilter(router.query);
                        router.push({ query });
                    }}
                >
                    {'Nullstill filtre'}
                </Button>
            </HStack>
        </VStack>
    );
};
