import {
    ÅpenBehandlingForOversikt,
    ÅpenBehandlingForOversiktType,
    ÅpentMeldekortSubType,
} from '~/lib/personoversikt/typer/ÅpenBehandlingForOversikt';
import { Alert, Button, Heading, HStack, Table, Tag, VStack } from '@navikt/ds-react';
import {
    behandlingResultatTilTag,
    finnBehandlingStatusTag,
    klagebehandlingResultatTilTag,
    klagebehandlingStatusTilTag,
} from '~/utils/tekstformateringUtils';
import { formaterMeldeperiode, formaterPeriode, formaterTidspunkt } from '~/utils/date';
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
import { erBehandlingSattPåVent } from '~/lib/behandling-felles/utils/behandlingUtils';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { meldekortbehandlingStatusTekst } from '~/lib/meldekort/utils/tekster';
import { meldekortbehandlingStatusFarge } from '~/lib/meldekort/utils/statusProps';
import { hentMeldekortbehandling, hentTilbakekreving } from '~/lib/sak/sakUtils';
import { meldekortbehandlingUrl, meldeperiodeUrl } from '~/utils/urls';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { MeldeperiodekjedeTab } from '~/lib/meldekort/meldeperiodekjede/høyre-seksjon/MeldeperiodekjedeHøyreSeksjon';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { MeldekortbehandlingMeny } from '~/lib/meldekort/felles/meny/MeldekortbehandlingMeny';
import NextLink from 'next/link';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { formatterBeløp } from '~/utils/beløp';
import { TilbakekrevingStatusTags } from '~/lib/tilbakekreving/status-tags/TilbakekrevingStatusTags';

type Props = {
    sak: SakProps;
};

export const ApneBehandlingerTabell = ({ sak }: Props) => {
    /* Brukers meldekort uten behandling vises i en egen seksjon (utledet fra meldeperiodekjedene).
     * Filteret kan fjernes når backend slutter å returnere disse blant de åpne behandlingene. */
    const åpneBehandlinger = sak.åpneBehandlinger.filter(
        (behandling) =>
            behandling.type !== ÅpenBehandlingForOversiktType.MELDEKORT ||
            behandling.subtype === ÅpentMeldekortSubType.MELDEKORTBEHANDLING,
    );

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
    åpneBehandlinger: ÅpenBehandlingForOversikt[];
    sak: SakProps;
};

const Tabell = ({ åpneBehandlinger, sak }: TabellProps) => {
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
                {åpneBehandlinger.map((behandling) => {
                    const { id, opprettet } = behandling;

                    const {
                        typeTekst,
                        resultatTag,
                        statusTag,
                        kravtidspunkt,
                        periodeTekst,
                        saksbehandler,
                        beslutter,
                        meny,
                    } = propsForRad(behandling, sak);

                    return (
                        <Table.Row shadeOnHover={false} key={id}>
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
    kravtidspunkt?: string;
    periodeTekst?: string;
    saksbehandler?: Nullable<string>;
    beslutter?: Nullable<string>;
    meny: React.ReactNode;
};

const propsForRad = (
    åpenBehandling: ÅpenBehandlingForOversikt,
    sak: SakProps,
): ÅpenBehandlingOversiktRadProps => {
    const { type } = åpenBehandling;
    const { saksnummer } = sak;

    const typeTekst = typeBehandlingTekst[åpenBehandling.type];

    switch (type) {
        case ÅpenBehandlingForOversiktType.SØKNAD: {
            return {
                typeTekst,
                statusTag: (
                    <Tag data-color="neutral" variant="outline">
                        {'Søknad'}
                    </Tag>
                ),
                kravtidspunkt: formaterTidspunkt(åpenBehandling.kravtidspunkt),
                meny: (
                    <Alert variant={'info'} size={'small'} inline={true}>
                        {'Søknadsbehandling opprettes automatisk'}
                    </Alert>
                ),
            };
        }
        case ÅpenBehandlingForOversiktType.SØKNADSBEHANDLING:
        case ÅpenBehandlingForOversiktType.REVURDERING: {
            const { saksbehandler, beslutter, resultat, periode } = åpenBehandling;

            return {
                typeTekst,
                resultatTag: behandlingResultatTilTag(resultat),
                statusTag: finnBehandlingStatusTag(
                    åpenBehandling.status,
                    åpenBehandling.underkjent,
                    åpenBehandling.erSattPåVent,
                ),
                saksbehandler,
                beslutter,
                periodeTekst: periode ? formaterPeriode(periode) : undefined,
                kravtidspunkt:
                    type === ÅpenBehandlingForOversiktType.SØKNADSBEHANDLING
                        ? formaterTidspunkt(åpenBehandling.kravtidspunkt)
                        : undefined,
                meny: (
                    <ApneBehandlingerMeny behandling={åpenBehandling} medAvsluttBehandling={true} />
                ),
            };
        }
        case ÅpenBehandlingForOversiktType.MELDEKORT: {
            const { periode, subtype } = åpenBehandling;

            if (subtype === ÅpentMeldekortSubType.MELDEKORTBEHANDLING) {
                const meldekortbehandling = hentMeldekortbehandling(sak, åpenBehandling.id);

                const { status, id, saksbehandler, beslutter } = meldekortbehandling;

                return {
                    typeTekst: meldekortSubTypeTekst[subtype],
                    statusTag: (
                        <HStack gap="space-4">
                            <Tag
                                data-color={meldekortbehandlingStatusFarge[status]}
                                variant="outline"
                            >
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

            return {
                typeTekst: meldekortSubTypeTekst[subtype],
                statusTag: null,
                saksbehandler: null,
                beslutter: null,
                periodeTekst: periode ? formaterMeldeperiode(periode) : undefined,
                meny: (
                    <Button
                        as={InternLenke}
                        variant={'secondary'}
                        size={'small'}
                        href={meldeperiodeUrl(
                            saksnummer,
                            periode,
                            MeldeperiodekjedeTab.BrukersMeldekort,
                        )}
                    >
                        {'Se meldekort'}
                    </Button>
                ),
            };
        }
        case ÅpenBehandlingForOversiktType.KLAGE: {
            const klagebehandling = sak.klagebehandlinger.find(
                (klage) => klage.id === åpenBehandling.id,
            )!;

            const utfall = hentSisteKlagehendelseUtfallFraKlagebehandling(klagebehandling);

            const omgjøringsbehandling =
                sak.rammebehandlinger.find(
                    (omgjøring) => omgjøring.id === klagebehandling.åpenBehandlingId,
                ) ??
                (klagebehandling.åpenBehandlingId &&
                    sak.meldekortbehandlinger[
                        klagebehandling.åpenBehandlingId as MeldekortbehandlingId
                    ]) ??
                null;

            return {
                typeTekst,
                statusTag: erBehandlingSattPåVent(klagebehandling) ? (
                    <Tag data-color="warning">Satt på vent</Tag>
                ) : (
                    klagebehandlingStatusTilTag({ status: åpenBehandling.status })
                ),
                resultatTag: åpenBehandling.resultat ? (
                    <HStack gap="space-4">
                        {klagebehandlingResultatTilTag({ resultat: åpenBehandling.resultat })}
                        {utfall && klagehendelseUtfallTilTag({ utfall: utfall })}
                    </HStack>
                ) : undefined,
                saksbehandler: åpenBehandling.saksbehandler,
                meny: (
                    <KlageMeny
                        klage={klagebehandling}
                        omgjøringsbehandling={omgjøringsbehandling}
                    />
                ),
            };
        }
        case ÅpenBehandlingForOversiktType.TILBAKEKREVING: {
            const { periode, status, totaltFeilutbetaltBeløp, saksbehandler, beslutter } =
                åpenBehandling;

            const { url, venter } = hentTilbakekreving(sak, åpenBehandling.id);

            return {
                typeTekst,
                resultatTag: `Feilutbetalt: ${formatterBeløp(totaltFeilutbetaltBeløp)}`,
                statusTag: <TilbakekrevingStatusTags status={status} venter={venter} />,
                saksbehandler,
                beslutter,
                periodeTekst: formaterPeriode(periode),
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

const typeBehandlingTekst: Record<ÅpenBehandlingForOversiktType, string> = {
    SØKNADSBEHANDLING: 'Søknadsbehandling',
    REVURDERING: 'Revurdering',
    SØKNAD: 'Søknad',
    MELDEKORT: 'Meldekort',
    KLAGE: 'Klage',
    TILBAKEKREVING: 'Tilbakekreving',
} as const;

const meldekortSubTypeTekst: Record<ÅpentMeldekortSubType, string> = {
    INNSENDT_MELDEKORT: 'Innsendt meldekort',
    KORRIGERT_MELDEKORT: 'Korrigert meldekort',
    MELDEKORTBEHANDLING: 'Meldekortbehandling',
} as const;
