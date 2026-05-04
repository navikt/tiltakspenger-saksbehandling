import { useEffect, useMemo, useState } from 'react';
import { Button, Checkbox, HelpText, HStack, Select, VStack } from '@navikt/ds-react';
import {
    BenkBehandlingKlarEllerVenter,
    BenkBehandlingsstatus,
    BenkBehandlingstype,
    BenkFilters,
    BenkOversiktProps,
} from '~/lib/benk/typer/Benk';
import { benkBehandlingsstatusTekst, benkBehandlingstypeTekst } from '~/lib/benk/benkSideUtils';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { useRouter } from 'next/router';
import {
    benkFiltersFraSearchParams,
    benkFiltersTilQueryParams,
    clearBenkFilterCookie,
    hentSaksbehandlereTilFiltrering,
    queryUtenBenkFilter,
    setBenkFilterCookie,
} from '~/lib/benk/filter/benkFilterUtils';
import { useSearchParams } from 'next/navigation';

type Props = {
    benkOversikt: BenkOversiktProps;
    onUpdateFilter: (filter: BenkFilters) => void;
};

export const BenkFilterVelger = ({ benkOversikt, onUpdateFilter }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const aktivtFilter = useMemo(() => benkFiltersFraSearchParams(searchParams), [searchParams]);

    const [isLoading, setIsLoading] = useState(false);

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

    const submitValgtFilter = (submittedFilters: BenkFilters) => {
        onUpdateFilter(submittedFilters);
        setIsLoading(true);

        router
            .push({
                query: {
                    ...queryUtenBenkFilter(router.query),
                    ...benkFiltersTilQueryParams(submittedFilters),
                },
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

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

            {valgtFilter.type === BenkBehandlingstype.TILBAKEKREVING && (
                <HStack gap={'space-4'} align={'center'}>
                    <Checkbox
                        size={'small'}
                        checked={!!valgtFilter.tilbakekrevingKunOverMinstebeløp}
                        onChange={(e) => {
                            oppdaterValgtFilter({
                                tilbakekrevingKunOverMinstebeløp: e.target.checked,
                            });
                        }}
                    >
                        {'Vis kun tilbakekrevinger over minstebeløp'}
                    </Checkbox>
                    <HelpText>
                        {
                            'Minstebeløpet for tilbakekreving er 5 380 kroner (fire ganger rettsgebyr)'
                        }
                    </HelpText>
                </HStack>
            )}

            <HStack gap={'space-16'}>
                <Button
                    type={'button'}
                    size={'small'}
                    loading={isLoading}
                    onClick={() => {
                        setBenkFilterCookie(valgtFilter);
                        submitValgtFilter(valgtFilter);
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
                        submitValgtFilter({
                            benktype: null,
                            saksbehandler: null,
                            status: null,
                            type: null,
                            tilbakekrevingKunOverMinstebeløp: null,
                        });
                    }}
                >
                    {'Nullstill filtre'}
                </Button>
            </HStack>
        </VStack>
    );
};
