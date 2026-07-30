import { ÅpenBehandlingId, ÅpenBehandlingType } from '~/lib/personoversikt/typer/ÅpenBehandling';
import { Alert, Button, Heading, HStack, Table, Tag, VStack } from '@navikt/ds-react';
import {
    behandlingResultatTilTag,
    finnBehandlingStatusTag,
    klagebehandlingResultatTilTag,
    klagebehandlingStatusTilTag,
} from '~/utils/tekstformateringUtils';
import { formaterPeriode, formaterTidspunkt } from '~/utils/date';
import { ApneBehandlingerMeny } from '~/lib/behandling-felles/behandlingmeny/ApneBehandlingerMeny';
import { SakProps } from '~/lib/sak/SakTyper';
import { Nullable } from '~/types/UtilTypes';
import KlageMeny from '~/lib/behandling-felles/behandlingmeny/KlageMeny';
import { hentSisteKlagehendelseUtfallFraKlagebehandling } from '~/lib/klage/utils/klageUtils';
import { klagehendelseUtfallTilTag } from '~/lib/klage/utils/KlageinstanshendelseUtils';
import {
    erMeldekortbehandlingSattPaVent,
    formaterMeldeperioder,
} from '~/lib/meldekort/utils/meldekortbehandlingUtils';
import {
    erBehandlingSattPåVent,
    erBehandlingUnderkjent,
} from '~/lib/behandling-felles/utils/behandlingUtils';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { meldekortbehandlingStatusTekst } from '~/lib/meldekort/utils/tekster';
import { meldekortbehandlingStatusFarge } from '~/lib/meldekort/utils/statusProps';
import {
    hentKlagebehandling,
    hentMeldekortbehandling,
    hentRammebehandling,
    hentSøknad,
    hentTilbakekreving,
} from '~/lib/sak/sakUtils';
import { meldekortbehandlingUrl } from '~/utils/urls';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { MeldekortbehandlingMeny } from '~/lib/meldekort/felles/meny/MeldekortbehandlingMeny';
import NextLink from 'next/link';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { formatterBeløp } from '~/utils/beløp';
import { TilbakekrevingStatusTags } from '~/lib/tilbakekreving/status-tags/TilbakekrevingStatusTags';
import { Rammebehandlingstype } from '~/lib/rammebehandling/typer/Rammebehandling';

type Props = {
    sak: SakProps;
};

export const ApneBehandlingerTabell = ({ sak }: Props) => {
    const { åpneBehandlingerIder } = sak;

    return (
        <VStack gap={'space-8'}>
            <Heading size={'small'} level={'2'}>
                {`Åpne behandlinger (${åpneBehandlingerIder.length})`}
            </Heading>

            {åpneBehandlingerIder.length === 0 ? (
                <Infokort variant={'info'}>{'Ingen åpne behandlinger på denne saken'}</Infokort>
            ) : (
                <Tabell åpneBehandlingerIder={åpneBehandlingerIder} sak={sak} />
            )}
        </VStack>
    );
};

type TabellProps = {
    åpneBehandlingerIder: ÅpenBehandlingId[];
    sak: SakProps;
};

const Tabell = ({ åpneBehandlingerIder, sak }: TabellProps) => {
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
                {åpneBehandlingerIder.map((åpenBehandlingId) => {
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
                    } = propsForRad(åpenBehandlingId, sak);

                    return (
                        <Table.Row shadeOnHover={false} key={åpenBehandlingId.id}>
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
    åpenBehandlingId: ÅpenBehandlingId,
    sak: SakProps,
): ÅpenBehandlingOversiktRadProps => {
    const { saksnummer } = sak;

    const typeTekst = typeBehandlingTekst[åpenBehandlingId.type];

    switch (åpenBehandlingId.type) {
        case ÅpenBehandlingType.SØKNAD: {
            const { opprettet, tidsstempelHosOss } = hentSøknad(sak, åpenBehandlingId.id);

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
            const rammebehandling = hentRammebehandling(sak, åpenBehandlingId.id);

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
                    <ApneBehandlingerMeny
                        behandling={rammebehandling}
                        medAvsluttBehandling={true}
                    />
                ),
            };
        }
        case ÅpenBehandlingType.MELDEKORT: {
            const meldekortbehandling = hentMeldekortbehandling(sak, åpenBehandlingId.id);

            const { id, opprettet, status, saksbehandler, beslutter } = meldekortbehandling;

            return {
                typeTekst,
                opprettet,
                statusTag: (
                    <HStack gap="space-4">
                        <Tag data-color={meldekortbehandlingStatusFarge[status]} variant="outline">
                            {meldekortbehandlingStatusTekst[status]}
                        </Tag>
                        {erMeldekortbehandlingSattPaVent(meldekortbehandling) && (
                            <Tag data-color="warning">{'Satt på vent'}</Tag>
                        )}
                    </HStack>
                ),
                saksbehandler,
                beslutter,
                periodeTekst: formaterMeldeperioder(meldekortbehandling),
                meny: (
                    <HStack gap={'space-8'} justify={'end'}>
                        <Button
                            as={NextLink}
                            variant={'secondary'}
                            size={'small'}
                            href={meldekortbehandlingUrl(saksnummer, id)}
                        >
                            {'Se behandling'}
                        </Button>

                        <MeldekortbehandlingMeny
                            meldekortbehandling={meldekortbehandling}
                            size={'small'}
                            skalNavigereTilBehandling={true}
                        />
                    </HStack>
                ),
            };
        }
        case ÅpenBehandlingType.KLAGE: {
            const klagebehandling = hentKlagebehandling(sak, åpenBehandlingId.id);

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
                    <KlageMeny
                        klage={klagebehandling}
                        omgjøringsbehandling={omgjøringsbehandling}
                    />
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
            } = hentTilbakekreving(sak, åpenBehandlingId.id);

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
