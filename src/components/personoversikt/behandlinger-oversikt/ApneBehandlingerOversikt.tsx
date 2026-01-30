import {
    ÅpenBehandlingForOversikt,
    ÅpenBehandlingForOversiktType,
} from '~/types/ÅpenBehandlingForOversikt';
import { Alert, Table, Tag } from '@navikt/ds-react';
import {
    behandlingResultatTilTag,
    finnBehandlingStatusTag,
    finnTypeBehandlingTekstForOversikt,
    klagebehandlingResultatTilTag,
    klagebehandlingStatusTilTag,
    meldeperiodeKjedeStatusTag,
} from '~/utils/tekstformateringUtils';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '~/utils/date';
import { ApneBehandlingerMeny } from '~/components/behandlingmeny/ApneBehandlingerMeny';
import { meldeperiodeUrl } from '~/utils/urls';
import { MeldeperiodeKjedeOversiktMeny } from '~/components/personoversikt/meldekort-oversikt/MeldekortOversikt';
import { SakProps } from '~/types/Sak';
import { Periode } from '~/types/Periode';
import { useSak } from '~/context/sak/SakContext';
import { Nullable } from '~/types/UtilTypes';
import KlageMeny from '~/components/behandlingmeny/KlageMeny';

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
                {åpneBehandlinger.map((åpenBehandling) => {
                    const { id, opprettet } = åpenBehandling;

                    const {
                        typeTekst,
                        resultatTag,
                        statusTag,
                        kravtidspunkt,
                        periode,
                        saksbehandler,
                        beslutter,
                        meny,
                    } = propsForRad(åpenBehandling, sak);

                    return (
                        <Table.Row shadeOnHover={false} key={id}>
                            <Table.DataCell>{typeTekst}</Table.DataCell>
                            <Table.DataCell>{resultatTag ?? '-'}</Table.DataCell>
                            <Table.DataCell>{statusTag}</Table.DataCell>
                            <Table.DataCell>{formaterTidspunkt(opprettet)}</Table.DataCell>
                            <Table.DataCell>{kravtidspunkt ?? '-'}</Table.DataCell>
                            <Table.DataCell>
                                {periode ? `${periodeTilFormatertDatotekst(periode)}` : '-'}
                            </Table.DataCell>
                            <Table.DataCell>{saksbehandler ?? 'Ikke tildelt'}</Table.DataCell>
                            <Table.DataCell>{beslutter ?? 'Ikke tildelt'}</Table.DataCell>
                            <Table.DataCell scope="col" align={'right'}>
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
    periode?: Nullable<Periode>;
    saksbehandler?: Nullable<string>;
    beslutter?: Nullable<string>;
    meny: React.ReactNode;
};

const propsForRad = (
    åpenBehandling: ÅpenBehandlingForOversikt,
    sak: SakProps,
): ÅpenBehandlingOversiktRadProps => {
    const { type, sakId, saksnummer } = åpenBehandling;

    const typeTekst = finnTypeBehandlingTekstForOversikt[type];

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
                resultatTag: behandlingResultatTilTag[resultat],
                statusTag: finnBehandlingStatusTag(
                    åpenBehandling.status,
                    åpenBehandling.underkjent,
                    åpenBehandling.erSattPåVent,
                ),
                saksbehandler,
                beslutter,
                periode,
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
            const { periode, meldekortBehandlingId, id, saksbehandler, beslutter, status } =
                åpenBehandling;

            const meldekortBehandling = meldekortBehandlingId
                ? sak.meldeperiodeKjeder
                      .find((kjede) => kjede.id === id)
                      ?.meldekortBehandlinger.find((it) => it.id === meldekortBehandlingId)
                : undefined;

            return {
                typeTekst,
                statusTag: meldeperiodeKjedeStatusTag[status],
                saksbehandler,
                beslutter,
                periode,
                meny: (
                    <MeldeperiodeKjedeOversiktMeny
                        sakId={sakId}
                        saksnummer={saksnummer}
                        kjedePeriode={periode}
                        meldekortBehandling={meldekortBehandling}
                        meldeperiodeUrl={meldeperiodeUrl(saksnummer, periode)}
                    />
                ),
            };
        }
        case ÅpenBehandlingForOversiktType.KLAGE: {
            const klagebehandling = sak.klageBehandlinger.find(
                (klage) => klage.id === åpenBehandling.id,
            )!;

            return {
                typeTekst,
                statusTag: klagebehandlingStatusTilTag[åpenBehandling.status],
                resultatTag: åpenBehandling.resultat
                    ? klagebehandlingResultatTilTag[åpenBehandling.resultat]
                    : undefined,
                saksbehandler: åpenBehandling.saksbehandler,
                meny: <KlageMeny klage={klagebehandling} />,
            };
        }
    }
};
