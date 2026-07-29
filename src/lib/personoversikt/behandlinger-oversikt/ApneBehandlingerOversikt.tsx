import {
    ÅpenBehandlingForOversikt,
    ÅpenBehandlingForOversiktType,
    ÅpentMeldekortSubType,
} from '~/lib/personoversikt/typer/ÅpenBehandlingForOversikt';
import { Alert, HStack, Table, Tag } from '@navikt/ds-react';
import {
    behandlingResultatTilTag,
    finnBehandlingStatusTag,
    klagebehandlingResultatTilTag,
    klagebehandlingStatusTilTag,
} from '~/utils/tekstformateringUtils';
import {
    formaterMeldeperiode,
    formaterPeriode,
    formaterTidspunkt,
    ukenummerFraPeriode,
} from '~/utils/date';
import { ApneBehandlingerMeny } from '~/lib/behandling-felles/behandlingmeny/ApneBehandlingerMeny';
import { SakProps } from '~/lib/sak/SakTyper';
import { useSak } from '~/lib/sak/SakContext';
import { Nullable } from '~/types/UtilTypes';
import KlageMeny from '~/lib/behandling-felles/behandlingmeny/KlageMeny';
import { hentSisteKlagehendelseUtfallFraKlagebehandling } from '~/lib/klage/utils/klageUtils';
import { klagehendelseUtfallTilTag } from '~/lib/klage/utils/KlageinstanshendelseUtils';
import { erMeldekortbehandlingSattPaVent } from '~/lib/meldekort/utils/meldekortbehandlingUtils';
import { erBehandlingSattPåVent } from '~/lib/behandling-felles/utils/behandlingUtils';
import {
    MeldekortbehandlingId,
    MeldekortbehandlingStatus,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { meldekortbehandlingStatusTekst } from '~/lib/meldekort/utils/tekster';
import { AkselColor } from '@navikt/ds-react/types/theme';
import { hentMeldekortbehandling } from '~/lib/sak/sakUtils';
import { meldekortbehandlingUrl, meldeperiodeUrl } from '~/utils/urls';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { MeldeperiodekjedeTab } from '~/lib/meldekort/meldeperiodekjede/høyre-seksjon/MeldeperiodekjedeHøyreSeksjon';

type Props = {
    åpneBehandlinger: ÅpenBehandlingForOversikt[];
};

export const ApneBehandlingerOversikt = ({ åpneBehandlinger }: Props) => {
    const { sak } = useSak();

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
    const { type, saksnummer } = åpenBehandling;

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

                const { status, periode, id, meldeperioder, saksbehandler, beslutter } =
                    meldekortbehandling;

                const antallPerioder = meldeperioder.length;

                const periodeTekst =
                    antallPerioder > 1
                        ? `${formaterPeriode(periode)} (${antallPerioder} meldeperioder, uke ${ukenummerFraPeriode(periode)})`
                        : formaterMeldeperiode(periode);

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
                    periodeTekst,
                    meny: (
                        <InternLenke href={meldekortbehandlingUrl(saksnummer, id)}>
                            {'Åpne'}
                        </InternLenke>
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
                    <InternLenke
                        href={meldeperiodeUrl(
                            saksnummer,
                            periode,
                            MeldeperiodekjedeTab.BrukersMeldekort,
                        )}
                    >
                        {'Åpne'}
                    </InternLenke>
                ),
            };
        }
        case ÅpenBehandlingForOversiktType.KLAGE: {
            const klagebehandling = sak.klageBehandlinger.find(
                (klage) => klage.id === åpenBehandling.id,
            )!;

            const utfall = hentSisteKlagehendelseUtfallFraKlagebehandling(klagebehandling);

            const omgjøringsbehandling =
                sak.behandlinger.find(
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
    }
};

const typeBehandlingTekst: Record<ÅpenBehandlingForOversiktType, string> = {
    SØKNADSBEHANDLING: 'Søknadsbehandling',
    REVURDERING: 'Revurdering',
    SØKNAD: 'Søknad',
    MELDEKORT: 'Meldekort',
    KLAGE: 'Klage',
} as const;

const meldekortbehandlingStatusFarge: Record<MeldekortbehandlingStatus, AkselColor> = {
    [MeldekortbehandlingStatus.KLAR_TIL_BEHANDLING]: 'info',
    [MeldekortbehandlingStatus.UNDER_BEHANDLING]: 'info',
    [MeldekortbehandlingStatus.KLAR_TIL_BESLUTNING]: 'info',
    [MeldekortbehandlingStatus.UNDER_BESLUTNING]: 'info',
    [MeldekortbehandlingStatus.GODKJENT]: 'success',
    [MeldekortbehandlingStatus.AUTOMATISK_BEHANDLET]: 'success',
    [MeldekortbehandlingStatus.IKKE_RETT_TIL_TILTAKSPENGER]: 'danger',
    [MeldekortbehandlingStatus.AVBRUTT]: 'neutral',
} as const;

const meldekortSubTypeTekst: Record<ÅpentMeldekortSubType, string> = {
    INNSENDT_MELDEKORT: 'Innsendt meldekort',
    KORRIGERT_MELDEKORT: 'Korrigert meldekort',
    MELDEKORTBEHANDLING: 'Meldekortbehandling',
} as const;
