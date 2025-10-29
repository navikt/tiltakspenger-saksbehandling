import {
    BehandlingEllerSøknadForOversikt,
    TypeBehandlingForOversikt,
} from '~/types/BehandlingForOversikt';
import { Table, Tag } from '@navikt/ds-react';
import {
    behandlingResultatTilText,
    finnBehandlingStatusTag,
    finnMeldeperiodeKjedeStatusTekst,
    finnTypeBehandlingTekstForOversikt,
} from '~/utils/tekstformateringUtils';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '~/utils/date';
import { ApneBehandlingerMeny } from '~/components/behandlingmeny/ApneBehandlingerMeny';
import { isBehandling, isSøknad } from '~/utils/behandlingForOversiktUtils';
import { StartSøknadBehandling } from '~/components/behandlingmeny/start-behandling/StartSøknadBehandling';
import { MeldeperiodeKjedeProps, MeldeperiodeKjedeStatus } from '~/types/meldekort/Meldeperiode';
import { sorterMeldekortBehandlingerAsc } from '~/utils/meldekort';
import { MeldekortBehandlingType } from '~/types/meldekort/MeldekortBehandling';
import { meldeperiodeUrl } from '~/utils/urls';
import { MeldeperiodeKjedeOversiktMeny } from '~/components/saksoversikt/meldekort-oversikt/MeldekortOversikt';
import { SakId } from '~/types/Sak';

type Props = {
    behandlinger: BehandlingEllerSøknadForOversikt[];
    meldeperiodeKjeder: MeldeperiodeKjedeProps[];
    saksnummer: string;
    sakId: SakId;
};

export const BehandlingerOversikt = ({
    behandlinger,
    meldeperiodeKjeder,
    saksnummer,
    sakId,
}: Props) => {
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Kravtidspunkt</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Beslutter</Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {behandlinger.map((behandlingEllerSøknad) => {
                    const { typeBehandling, resultat } = behandlingEllerSøknad;

                    const typeTekst = finnTypeBehandlingTekstForOversikt[typeBehandling];

                    const resultatTekst =
                        typeBehandling === TypeBehandlingForOversikt.SØKNAD
                            ? ''
                            : ` (${behandlingResultatTilText[resultat].toLowerCase()})`;

                    return (
                        <Table.Row shadeOnHover={false} key={behandlingEllerSøknad.id}>
                            <Table.DataCell>{`${typeTekst}${resultatTekst}`}</Table.DataCell>
                            <Table.DataCell>
                                {typeBehandling === TypeBehandlingForOversikt.SØKNAD ? (
                                    <Tag variant="neutral">{'Søknad'}</Tag>
                                ) : (
                                    finnBehandlingStatusTag(
                                        behandlingEllerSøknad.status,
                                        behandlingEllerSøknad.underkjent,
                                        behandlingEllerSøknad.erSattPåVent,
                                    )
                                )}
                            </Table.DataCell>
                            <Table.DataCell>
                                {behandlingEllerSøknad.kravtidspunkt
                                    ? formaterTidspunkt(behandlingEllerSøknad.kravtidspunkt)
                                    : '-'}
                            </Table.DataCell>
                            <Table.DataCell>
                                {behandlingEllerSøknad.periode &&
                                    `${periodeTilFormatertDatotekst(behandlingEllerSøknad.periode)}`}
                            </Table.DataCell>
                            <Table.DataCell>
                                {behandlingEllerSøknad.saksbehandler ?? 'Ikke tildelt'}
                            </Table.DataCell>
                            <Table.DataCell>
                                {behandlingEllerSøknad.beslutter ?? 'Ikke tildelt'}
                            </Table.DataCell>
                            <Table.DataCell scope="col" align={'right'}>
                                {isBehandling(behandlingEllerSøknad) && (
                                    <ApneBehandlingerMeny
                                        behandling={behandlingEllerSøknad}
                                        medAvsluttBehandling
                                    />
                                )}
                                {isSøknad(behandlingEllerSøknad) && (
                                    <StartSøknadBehandling
                                        søknad={behandlingEllerSøknad}
                                        medAvsluttBehandling
                                    />
                                )}
                            </Table.DataCell>
                        </Table.Row>
                    );
                })}
                {meldeperiodeKjeder
                    .toSorted((a, b) => (a.periode.fraOgMed > b.periode.fraOgMed ? -1 : 1))
                    .map((kjede) => {
                        const {
                            meldekortBehandlinger,
                            status,
                            periode,
                            korrigeringFraTidligerePeriode,
                        } = kjede;

                        const sisteMeldekortBehandling =
                            meldekortBehandlinger.toSorted(sorterMeldekortBehandlingerAsc).at(0) ||
                            null;

                        const erKorrigering =
                            status !== MeldeperiodeKjedeStatus.KORRIGERT_MELDEKORT &&
                            sisteMeldekortBehandling?.type === MeldekortBehandlingType.KORRIGERING;

                        const korrigeringTekst =
                            korrigeringFraTidligerePeriode && sisteMeldekortBehandling?.erAvsluttet
                                ? ` (korrigert via ${periodeTilFormatertDatotekst(korrigeringFraTidligerePeriode.periode)})`
                                : erKorrigering
                                  ? ' (korrigering)'
                                  : '';

                        return (
                            <Table.Row shadeOnHover={false} key={kjede.id}>
                                <Table.DataCell>Meldekort</Table.DataCell>
                                <Table.DataCell>
                                    {`${finnMeldeperiodeKjedeStatusTekst[status]}${korrigeringTekst}`}
                                </Table.DataCell>
                                <Table.DataCell>-</Table.DataCell>
                                <Table.DataCell>
                                    {`${periodeTilFormatertDatotekst(kjede.periode)}`}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {(!(status === MeldeperiodeKjedeStatus.AUTOMATISK_BEHANDLET) &&
                                        sisteMeldekortBehandling?.saksbehandler) ||
                                        'Ikke tildelt'}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {(!(status === MeldeperiodeKjedeStatus.AUTOMATISK_BEHANDLET) &&
                                        sisteMeldekortBehandling?.beslutter) ||
                                        'Ikke tildelt'}
                                </Table.DataCell>
                                <Table.DataCell scope="col" align={'right'}>
                                    <MeldeperiodeKjedeOversiktMeny
                                        sakId={sakId}
                                        saksnummer={saksnummer}
                                        kjedePeriode={periode}
                                        meldekortBehandling={sisteMeldekortBehandling}
                                        meldeperiodeUrl={meldeperiodeUrl(saksnummer, periode)}
                                    />
                                </Table.DataCell>
                            </Table.Row>
                        );
                    })}
            </Table.Body>
        </Table>
    );
};
