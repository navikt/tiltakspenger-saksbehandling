import { BehandlingEllerSøknadForOversiktData, Behandlingstype } from '~/types/BehandlingTypes';
import { Table } from '@navikt/ds-react';
import {
    finnBehandlingStatusTag,
    finnBehandlingstypeTekst,
    finnMeldeperiodeKjedeStatusTekst,
    revurderingResultatTekst,
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
import { SakId } from '~/types/SakTypes';

type Props = {
    behandlinger: BehandlingEllerSøknadForOversiktData[];
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
                {behandlinger.map((behandling) => {
                    const { typeBehandling, resultat } = behandling;

                    const typeTekst = finnBehandlingstypeTekst[typeBehandling];

                    const revurderingTekst =
                        typeBehandling === Behandlingstype.REVURDERING
                            ? ` (${revurderingResultatTekst[resultat]})`
                            : '';

                    return (
                        <Table.Row shadeOnHover={false} key={behandling.id}>
                            <Table.DataCell>{`${typeTekst}${revurderingTekst}`}</Table.DataCell>
                            <Table.DataCell>
                                {finnBehandlingStatusTag(
                                    behandling.status,
                                    behandling.underkjent,
                                    behandling.erSattPåVent,
                                )}
                            </Table.DataCell>
                            <Table.DataCell>
                                {behandling.kravtidspunkt
                                    ? formaterTidspunkt(behandling.kravtidspunkt)
                                    : '-'}
                            </Table.DataCell>
                            <Table.DataCell>
                                {behandling.periode &&
                                    `${periodeTilFormatertDatotekst(behandling.periode)}`}
                            </Table.DataCell>
                            <Table.DataCell>
                                {behandling.saksbehandler ?? 'Ikke tildelt'}
                            </Table.DataCell>
                            <Table.DataCell>
                                {behandling.beslutter ?? 'Ikke tildelt'}
                            </Table.DataCell>
                            <Table.DataCell scope="col" align={'right'}>
                                {isBehandling(behandling) && (
                                    <ApneBehandlingerMeny
                                        behandling={behandling}
                                        medAvsluttBehandling
                                    />
                                )}
                                {isSøknad(behandling) && (
                                    <StartSøknadBehandling
                                        søknad={behandling}
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
