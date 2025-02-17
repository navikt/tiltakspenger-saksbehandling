import { BehandlingForOversiktProps } from '../../../types/BehandlingTypes';
import { Button, Table } from '@navikt/ds-react';
import {
    finnBehandlingstypeTekst,
    finnBehandlingStatusTekst,
} from '../../../utils/tekstformateringUtils';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '../../../utils/date';
import { BehandlingKnappForOversikt } from '../../behandlingsknapper/BehandlingKnappForOversikt';
import router from 'next/router';

type Props = {
    behandlinger: BehandlingForOversiktProps[];
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
                            <BehandlingKnappForOversikt behandling={behandling} />
                        </Table.DataCell>
                        <Table.DataCell>
                            <Button
                                style={{ minWidth: '50%' }}
                                size="small"
                                variant={'secondary'}
                                onClick={() =>
                                    router.push(`/behandling/${behandling.id}/oppsummering`)
                                }
                            >
                                Se behandling
                            </Button>
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};
