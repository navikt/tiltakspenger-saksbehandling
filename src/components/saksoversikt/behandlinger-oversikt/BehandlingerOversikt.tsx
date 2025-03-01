import { BehandlingEllerSøknadForOversiktData } from '../../../types/BehandlingTypes';
import { Button, Table } from '@navikt/ds-react';
import {
    finnBehandlingstypeTekst,
    finnBehandlingStatusTekst,
} from '../../../utils/tekstformateringUtils';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '../../../utils/date';
import { BehandlingKnappForOversikt } from '../../behandlingsknapper/BehandlingKnappForOversikt';
import Link from 'next/link';
import { isBehandling, isSøknad } from '../../../utils/behandlingForOversiktUtils';
import { StartSøknadBehandling } from '../../behandlingsknapper/start-behandling/StartSøknadBehandling';

type Props = {
    behandlinger: BehandlingEllerSøknadForOversiktData[];
};

export const BehandlingerOversikt = ({ behandlinger }: Props) => {
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Kravtidspunkt</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Beslutter</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Handlinger</Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {behandlinger.map((behandling) => (
                    <Table.Row shadeOnHover={false} key={behandling.id}>
                        <Table.DataCell>
                            {finnBehandlingstypeTekst[behandling.typeBehandling]}
                        </Table.DataCell>
                        <Table.DataCell>
                            {behandling.kravtidspunkt
                                ? formaterTidspunkt(behandling.kravtidspunkt)
                                : 'Ukjent'}
                        </Table.DataCell>
                        <Table.DataCell>
                            {finnBehandlingStatusTekst(behandling.status, behandling.underkjent)}
                        </Table.DataCell>
                        <Table.DataCell>
                            {behandling.periode &&
                                `${periodeTilFormatertDatotekst(behandling.periode)}`}
                        </Table.DataCell>
                        <Table.DataCell>
                            {behandling.saksbehandler ?? 'Ikke tildelt'}
                        </Table.DataCell>
                        <Table.DataCell>{behandling.beslutter ?? 'Ikke tildelt'}</Table.DataCell>
                        <Table.DataCell scope="col">
                            {isBehandling(behandling) && (
                                <BehandlingKnappForOversikt
                                    behandling={behandling}
                                    medAvsluttBehandling
                                />
                            )}
                            {isSøknad(behandling) && (
                                <StartSøknadBehandling søknad={behandling} medAvsluttBehandling />
                            )}
                        </Table.DataCell>
                        <Table.DataCell>
                            {isBehandling(behandling) && (
                                <Button
                                    style={{ minWidth: '50%' }}
                                    size="small"
                                    variant={'secondary'}
                                    as={Link}
                                    href={`/behandling/${behandling.id}`}
                                >
                                    Se behandling
                                </Button>
                            )}
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};
