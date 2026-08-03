import { ÅpenBehandling, ÅpenBehandlingType } from '~/lib/personoversikt/typer/ÅpenBehandling';
import { Alert, Button, Heading, HStack, Table, Tag, VStack } from '@navikt/ds-react';
import {
    behandlingResultatTilTag,
    finnBehandlingStatusTag,
    klagebehandlingResultatTilTag,
    klagebehandlingStatusTilTag,
} from '~/utils/tekstformateringUtils';
import { formaterPeriode, formaterTidspunkt } from '~/utils/date';
import { SakProps } from '~/lib/sak/SakTyper';
import { Nullable } from '~/types/UtilTypes';
import KlageMeny from '~/lib/klage/meny/KlageMeny';
import {
    finnSisteGyldigeStegForKlage,
    hentSisteKlagehendelseUtfallFraKlagebehandling,
    kanFortsetteKlagebehandling,
} from '~/lib/klage/utils/klageUtils';
import { klagehendelseUtfallTilTag } from '~/lib/klage/utils/KlageinstanshendelseUtils';
import { formaterMeldeperioder } from '~/lib/meldekort/utils/meldekortbehandlingUtils';
import {
    erBehandlingSattPåVent,
    erBehandlingUnderkjent,
} from '~/lib/behandling-felles/utils/behandlingUtils';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import {
    hentKlagebehandling,
    hentMeldekortbehandling,
    hentRammebehandling,
    hentSøknad,
    hentTilbakekreving,
} from '~/lib/sak/sakUtils';
import { behandlingUrl, meldekortbehandlingUrl } from '~/utils/urls';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { Saksbehandler } from '~/lib/saksbehandler/SaksbehandlerTyper';
import { kanFortsetteBehandling } from '~/lib/saksbehandler/tilganger';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { MeldekortbehandlingMeny } from '~/lib/meldekort/felles/meny/MeldekortbehandlingMeny';
import { MeldekortbehandlingStatusTags } from '~/lib/meldekort/meldekortbehandling/header/behandling-status/MeldekortbehandlingStatusTags';
import { TilBehandlingKnapp } from '~/lib/personoversikt/TilBehandlingKnapp';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { formatterBeløp } from '~/utils/beløp';
import { TilbakekrevingStatusTags } from '~/lib/tilbakekreving/status-tags/TilbakekrevingStatusTags';
import { Rammebehandlingstype } from '~/lib/rammebehandling/typer/Rammebehandling';
import { RammebehandlingMeny } from '~/lib/rammebehandling/felles/meny/RammebehandlingMeny';

type Props = {
    sak: SakProps;
};

export const ApneBehandlingerTabell = ({ sak }: Props) => {
    const { åpneBehandlinger } = sak;

    return (
        <VStack gap={'space-8'}>
            <Heading size={'small'} level={'2'}>
                {`Åpne behandlinger (${åpneBehandlinger.length})`}
            </Heading>

            {åpneBehandlinger.length === 0 ? (
                <Infokort variant={'info'}>{'Ingen åpne behandlinger på denne saken'}</Infokort>
            ) : (
                <Tabell åpneBehandlinger={åpneBehandlinger} sak={sak} />
            )}
        </VStack>
    );
};

type TabellProps = {
    åpneBehandlinger: ÅpenBehandling[];
    sak: SakProps;
};

const Tabell = ({ åpneBehandlinger, sak }: TabellProps) => {
    const { innloggetSaksbehandler } = useSaksbehandler();

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Resultat</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Opprettet</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Kravtidspunkt</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Beslutter</Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {åpneBehandlinger.map((åpenBehandling) => {
                    const {
                        typeTekst,
                        resultatTag,
                        statusTag,
                        opprettet,
                        kravtidspunkt,
                        periodeTekst,
                        saksbehandler,
                        beslutter,
                        meny,
                    } = propsForRad(åpenBehandling, sak, innloggetSaksbehandler);

                    return (
                        <Table.Row shadeOnHover={false} key={åpenBehandling.id}>
                            <Table.DataCell>{typeTekst}</Table.DataCell>
                            <Table.DataCell>{resultatTag ?? '-'}</Table.DataCell>
                            <Table.DataCell>{statusTag}</Table.DataCell>
                            <Table.DataCell>{formaterTidspunkt(opprettet)}</Table.DataCell>
                            <Table.DataCell>{kravtidspunkt ?? '-'}</Table.DataCell>
                            <Table.DataCell>{periodeTekst ?? '-'}</Table.DataCell>
                            <Table.DataCell>{saksbehandler ?? 'Ikke tildelt'}</Table.DataCell>
                            <Table.DataCell>{beslutter ?? 'Ikke tildelt'}</Table.DataCell>
                            <Table.DataCell scope={'col'} align={'right'}>
                                {meny}
                            </Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
};

type ÅpenBehandlingOversiktRadProps = {
    typeTekst: string;
    resultatTag?: React.ReactNode;
    statusTag: React.ReactNode;
    opprettet: string;
    kravtidspunkt?: string;
    periodeTekst?: string;
    saksbehandler?: Nullable<string>;
    beslutter?: Nullable<string>;
    meny: React.ReactNode;
};

const propsForRad = (
    åpenBehandling: ÅpenBehandling,
    sak: SakProps,
    innloggetSaksbehandler: Saksbehandler,
): ÅpenBehandlingOversiktRadProps => {
    const { saksnummer } = sak;

    const typeTekst = typeBehandlingTekst[åpenBehandling.type];

    switch (åpenBehandling.type) {
        case ÅpenBehandlingType.SØKNAD: {
            const { opprettet, tidsstempelHosOss } = hentSøknad(sak, åpenBehandling.id);

            return {
                typeTekst,
                opprettet,
                statusTag: (
                    <Tag data-color="neutral" variant="outline">
                        {'Søknad'}
                    </Tag>
                ),
                kravtidspunkt: formaterTidspunkt(tidsstempelHosOss),
                meny: (
                    <Alert variant={'info'} size={'small'} inline={true}>
                        {'Søknadsbehandling opprettes automatisk'}
                    </Alert>
                ),
            };
        }
        case ÅpenBehandlingType.SØKNADSBEHANDLING:
        case ÅpenBehandlingType.REVURDERING: {
            const rammebehandling = hentRammebehandling(sak, åpenBehandling.id);

            const { opprettet, status, resultat, saksbehandler, beslutter, vedtaksperiode } =
                rammebehandling;

            return {
                typeTekst,
                opprettet,
                resultatTag: behandlingResultatTilTag(resultat),
                statusTag: finnBehandlingStatusTag(
                    status,
                    erBehandlingUnderkjent(rammebehandling),
                    erBehandlingSattPåVent(rammebehandling),
                ),
                saksbehandler,
                beslutter,
                periodeTekst: vedtaksperiode ? formaterPeriode(vedtaksperiode) : undefined,
                kravtidspunkt:
                    rammebehandling.type === Rammebehandlingstype.SØKNADSBEHANDLING
                        ? formaterTidspunkt(rammebehandling.søknad.tidsstempelHosOss)
                        : undefined,
                meny: (
                    <HStack gap={'space-8'} justify={'end'} align={'center'} wrap={false}>
                        <TilBehandlingKnapp
                            href={behandlingUrl({ saksnummer, id: rammebehandling.id })}
                        >
                            {kanFortsetteBehandling(rammebehandling, innloggetSaksbehandler)
                                ? 'Fortsett'
                                : 'Se behandling'}
                        </TilBehandlingKnapp>

                        <RammebehandlingMeny
                            behandling={rammebehandling}
                            kallesFra={'personoversikt'}
                            size={'small'}
                        />
                    </HStack>
                ),
            };
        }
        case ÅpenBehandlingType.MELDEKORT: {
            const meldekortbehandling = hentMeldekortbehandling(sak, åpenBehandling.id);

            const { id, opprettet, saksbehandler, beslutter } = meldekortbehandling;

            return {
                typeTekst,
                opprettet,
                statusTag: (
                    <MeldekortbehandlingStatusTags
                        meldekortbehandling={meldekortbehandling}
                        kompakt={true}
                    />
                ),
                saksbehandler,
                beslutter,
                periodeTekst: formaterMeldeperioder(meldekortbehandling),
                meny: (
                    <HStack gap={'space-8'} justify={'end'} align={'center'} wrap={false}>
                        <TilBehandlingKnapp href={meldekortbehandlingUrl(saksnummer, id)}>
                            {'Se behandling'}
                        </TilBehandlingKnapp>

                        <MeldekortbehandlingMeny
                            meldekortbehandling={meldekortbehandling}
                            kallesFra={'personoversikt'}
                            size={'small'}
                        />
                    </HStack>
                ),
            };
        }
        case ÅpenBehandlingType.KLAGE: {
            const klagebehandling = hentKlagebehandling(sak, åpenBehandling.id);

            const {
                opprettet,
                status,
                resultat,
                saksbehandler,
                åpenBehandlingId: omgjøringId,
            } = klagebehandling;

            const utfall = hentSisteKlagehendelseUtfallFraKlagebehandling(klagebehandling);

            const omgjøringsbehandling =
                sak.rammebehandlinger.find((omgjøring) => omgjøring.id === omgjøringId) ??
                (omgjøringId && sak.meldekortbehandlinger[omgjøringId as MeldekortbehandlingId]) ??
                null;

            return {
                typeTekst,
                opprettet,
                statusTag: erBehandlingSattPåVent(klagebehandling) ? (
                    <Tag data-color="warning">{'Satt på vent'}</Tag>
                ) : (
                    klagebehandlingStatusTilTag({ status })
                ),
                resultatTag: resultat ? (
                    <HStack gap="space-4">
                        {klagebehandlingResultatTilTag({ resultat: resultat.type })}
                        {utfall && klagehendelseUtfallTilTag({ utfall })}
                    </HStack>
                ) : undefined,
                saksbehandler,
                meny: (
                    <HStack gap={'space-8'} justify={'end'} align={'center'} wrap={false}>
                        <TilBehandlingKnapp href={finnSisteGyldigeStegForKlage(klagebehandling)}>
                            {kanFortsetteKlagebehandling(
                                klagebehandling,
                                omgjøringsbehandling,
                                innloggetSaksbehandler,
                            )
                                ? 'Fortsett'
                                : 'Se behandling'}
                        </TilBehandlingKnapp>

                        <KlageMeny
                            klage={klagebehandling}
                            omgjøringsbehandling={omgjøringsbehandling}
                        />
                    </HStack>
                ),
            };
        }
        case ÅpenBehandlingType.TILBAKEKREVING: {
            const {
                opprettet,
                status,
                venter,
                url,
                kravgrunnlagTotalPeriode,
                totaltFeilutbetaltBeløp,
                saksbehandler,
                beslutter,
            } = hentTilbakekreving(sak, åpenBehandling.id);

            return {
                typeTekst,
                opprettet,
                resultatTag: `Feilutbetalt: ${formatterBeløp(totaltFeilutbetaltBeløp)}`,
                statusTag: <TilbakekrevingStatusTags status={status} venter={venter} />,
                saksbehandler,
                beslutter,
                periodeTekst: formaterPeriode(kravgrunnlagTotalPeriode),
                meny: (
                    <Button
                        as={'a'}
                        href={url}
                        variant={'secondary'}
                        size={'small'}
                        icon={<ExternalLinkIcon aria-hidden />}
                        iconPosition={'right'}
                        target={'_blank'}
                    >
                        {'Åpne tilbakekreving'}
                    </Button>
                ),
            };
        }
    }
};

const typeBehandlingTekst: Record<ÅpenBehandlingType, string> = {
    SØKNADSBEHANDLING: 'Søknadsbehandling',
    REVURDERING: 'Revurdering',
    SØKNAD: 'Søknad',
    MELDEKORT: 'Meldekortbehandling',
    KLAGE: 'Klage',
    TILBAKEKREVING: 'Tilbakekreving',
} as const;
