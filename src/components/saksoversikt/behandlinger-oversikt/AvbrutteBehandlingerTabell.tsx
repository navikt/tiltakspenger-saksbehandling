import { AvbruttSøknadEllerBehandlingCellInfo } from './AvsluttedeBehandlingerUtils';
import { Button, Table } from '@navikt/ds-react';
import { finnTypeBehandlingTekstForOversikt } from '~/utils/tekstformateringUtils';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '~/utils/date';
import Link from 'next/link';
import { behandlingUrl } from '~/utils/urls';
import { Rammebehandlingstype } from '~/types/Behandling';
import { TypeBehandlingForOversikt } from '~/types/BehandlingForOversikt';

export const AvbrutteBehandlingerTabell = (props: {
    saksnummer: string;
    avbrutteBehandlinger: AvbruttSøknadEllerBehandlingCellInfo[];
}) => {
    if (props.avbrutteBehandlinger.length === 0) {
        return null;
    }

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Behandlingstype</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Tidspunkt avsluttet</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Behandlingsperiode</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Beslutter</Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {props.avbrutteBehandlinger.map((avsluttet, idx) => (
                    <Table.Row shadeOnHover={false} key={`${avsluttet.tidspunktAvsluttet}-${idx}`}>
                        <Table.DataCell>
                            {finnTypeBehandlingTekstForOversikt[avsluttet.behandlingstype]}
                        </Table.DataCell>
                        <Table.DataCell>
                            {formaterTidspunkt(avsluttet.tidspunktAvsluttet)}
                        </Table.DataCell>
                        <Table.DataCell>
                            {avsluttet.behandlingsperiode
                                ? periodeTilFormatertDatotekst(avsluttet.behandlingsperiode)
                                : 'Ingen periode'}
                        </Table.DataCell>
                        <Table.DataCell>{avsluttet.saksbehandler ?? 'Ikke tildelt'}</Table.DataCell>
                        <Table.DataCell>{avsluttet.beslutter ?? 'Ikke tildelt'}</Table.DataCell>
                        <Table.DataCell align={'right'}>
                            {(avsluttet.behandlingstype ===
                                Rammebehandlingstype.SØKNADSBEHANDLING ||
                                avsluttet.behandlingstype === Rammebehandlingstype.REVURDERING) && (
                                <Button
                                    style={{ minWidth: '50%' }}
                                    size="small"
                                    variant={'secondary'}
                                    as={Link}
                                    href={behandlingUrl({
                                        saksnummer: props.saksnummer,
                                        id: avsluttet.id,
                                    })}
                                >
                                    Se behandling
                                </Button>
                            )}
                            {avsluttet.behandlingstype === TypeBehandlingForOversikt.SØKNAD && (
                                <Button
                                    style={{ minWidth: '50%' }}
                                    size="small"
                                    variant={'secondary'}
                                    as={Link}
                                    href={`/sak/${props.saksnummer}/avbrutt/${avsluttet.id}`}
                                >
                                    Se søknad
                                </Button>
                            )}
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};
