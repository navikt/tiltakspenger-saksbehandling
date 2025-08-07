import { BehandlingEllerSøknadForOversiktData, Behandlingstype } from '~/types/BehandlingTypes';
import { Table } from '@navikt/ds-react';
import {
    finnBehandlingStatusTag,
    finnBehandlingstypeTekst,
    revurderingResultatTekst,
} from '~/utils/tekstformateringUtils';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '~/utils/date';
import { ApneBehandlingerMeny } from '~/components/behandlingmeny/ApneBehandlingerMeny';
import { isBehandling, isSøknad } from '~/utils/behandlingForOversiktUtils';
import { StartSøknadBehandling } from '~/components/behandlingmeny/start-behandling/StartSøknadBehandling';

type Props = {
    behandlinger: BehandlingEllerSøknadForOversiktData[];
};

export const BehandlingerOversikt = ({ behandlinger }: Props) => {
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
                                    : 'Ukjent'}
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
            </Table.Body>
        </Table>
    );
};
