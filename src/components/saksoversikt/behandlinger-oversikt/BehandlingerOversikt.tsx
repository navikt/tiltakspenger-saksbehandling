import { BehandlingForBenk, BehandlingStatus } from '../../../types/BehandlingTypes';
import { Button, Table } from '@navikt/ds-react';
import { finnBehandlingstypeTekst, finnStatusTekst } from '../../../utils/tekstformateringUtils';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '../../../utils/date';
import { knappForBehandlingType } from '../../behandlingsknapper/Benkknapp';
import { eierBehandling, skalKunneTaBehandling } from '../../../utils/tilganger';
import router from 'next/router';
import { useContext } from 'react';
import { SaksbehandlerContext } from '../../../context/saksbehandler/SaksbehandlerContext';
import { useOpprettBehandling } from '../../../hooks/useOpprettBehandling';
import { useTaBehandling } from '../../../hooks/useTaBehandling';

type Props = {
    behandlinger: BehandlingForBenk[];
};

export const BehandlingerOversikt = ({ behandlinger }: Props) => {
    const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);
    const { onOpprettBehandling, isSøknadMutating } = useOpprettBehandling();
    const { onTaBehandling, isBehandlingMutating } = useTaBehandling();

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
                            {finnBehandlingstypeTekst(behandling.typeBehandling)}
                        </Table.DataCell>
                        <Table.DataCell>
                            {formaterTidspunkt(behandling.kravtidspunkt) ?? 'Ukjent'}
                        </Table.DataCell>
                        <Table.DataCell>
                            {finnStatusTekst(behandling.status, behandling.underkjent)}
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
                            {knappForBehandlingType(
                                behandling.status,
                                behandling.id,
                                eierBehandling(
                                    behandling.status,
                                    innloggetSaksbehandler,
                                    behandling.saksbehandler,
                                    behandling.beslutter,
                                ),
                                skalKunneTaBehandling(
                                    behandling.status,
                                    innloggetSaksbehandler,
                                    behandling.saksbehandler,
                                ),
                                onOpprettBehandling,
                                onTaBehandling,
                                isSøknadMutating,
                                isBehandlingMutating,
                            )}
                        </Table.DataCell>
                        <Table.DataCell>
                            {behandling.status !== BehandlingStatus.SØKNAD && (
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
                            )}
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};
