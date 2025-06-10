import { AvsluttetBehandlingDataCellInfo } from './AvsluttedeBehandlingerUtils';
import { Button, Table } from '@navikt/ds-react';
import {
    behandlingResultatTilTekst,
    finnBehandlingstypeTekst,
} from '../../../utils/tekstformateringUtils';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '../../../utils/date';
import { Behandlingstype } from '../../../types/BehandlingTypes';
import Link from 'next/link';

export const VedtatteBehandlingerTabell = (props: {
    vedtatteBehandlinger: AvsluttetBehandlingDataCellInfo[];
}) => {
    if (props.vedtatteBehandlinger.length === 0) {
        return null;
    }

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Behandlingstype</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Resultat</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Tidspunkt iverksatt</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Behandlingsperiode</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Beslutter</Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {props.vedtatteBehandlinger.map((vedtattBehandling, idx) => (
                    <Table.Row
                        shadeOnHover={false}
                        key={`${vedtattBehandling.tidspunktAvsluttet}-${idx}`}
                    >
                        <Table.DataCell>
                            {finnBehandlingstypeTekst[vedtattBehandling.behandlingstype]}
                        </Table.DataCell>
                        <Table.DataCell>
                            {vedtattBehandling.resultat
                                ? behandlingResultatTilTekst[vedtattBehandling.resultat]
                                : '-'}
                        </Table.DataCell>
                        <Table.DataCell>
                            {formaterTidspunkt(vedtattBehandling.tidspunktAvsluttet)}
                        </Table.DataCell>
                        <Table.DataCell>
                            {vedtattBehandling.behandlingsperiode
                                ? periodeTilFormatertDatotekst(vedtattBehandling.behandlingsperiode)
                                : 'Ingen periode'}
                        </Table.DataCell>

                        <Table.DataCell>
                            {vedtattBehandling.saksbehandler ?? 'Ikke tildelt'}
                        </Table.DataCell>
                        <Table.DataCell>
                            {vedtattBehandling.beslutter ?? 'Ikke tildelt'}
                        </Table.DataCell>
                        <Table.DataCell>
                            {(vedtattBehandling.behandlingstype ===
                                Behandlingstype.SØKNADSBEHANDLING ||
                                vedtattBehandling.behandlingstype ===
                                    Behandlingstype.REVURDERING) && (
                                <Button
                                    style={{ minWidth: '50%' }}
                                    size="small"
                                    variant={'secondary'}
                                    as={Link}
                                    href={`/behandling/${vedtattBehandling.id}`}
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
