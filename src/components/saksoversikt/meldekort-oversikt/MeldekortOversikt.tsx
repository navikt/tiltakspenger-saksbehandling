import { MeldeperiodeSammendragProps, MeldeperiodeStatus } from '../../../types/MeldekortTypes';
import { Button, Table } from '@navikt/ds-react';
import { finnMeldeperiodeStatusTekst } from '../../../utils/tekstformateringUtils';
import { periodeTilFormatertDatotekst } from '../../../utils/date';
import Link from 'next/link';

type Props = {
    meldeperioder: MeldeperiodeSammendragProps[];
    saksnummer: string;
};

export const MeldekortOversikt = ({ meldeperioder, saksnummer }: Props) => {
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Beslutter</Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {meldeperioder
                    .sort((a, b) => (a.periode.fraOgMed > b.periode.fraOgMed ? -1 : 1))
                    .map((meldeperiode) => (
                        <Table.Row shadeOnHover={false} key={meldeperiode.hendelseId}>
                            <Table.DataCell>
                                {finnMeldeperiodeStatusTekst[meldeperiode.status]}
                            </Table.DataCell>
                            <Table.DataCell>
                                {meldeperiode.periode &&
                                    `${periodeTilFormatertDatotekst(meldeperiode.periode)}`}
                            </Table.DataCell>
                            <Table.DataCell>{meldeperiode.saksbehandler ?? '-'}</Table.DataCell>
                            <Table.DataCell>{meldeperiode.beslutter ?? '-'}</Table.DataCell>
                            <Table.DataCell>
                                {meldeperiode.status !==
                                    MeldeperiodeStatus.IKKE_KLAR_TIL_UTFYLLING && (
                                    <Button
                                        as={Link}
                                        href={`/sak/${saksnummer}/meldeperiode/${encodeURIComponent(meldeperiode.meldeperiodeId)}`}
                                        style={{ minWidth: '50%' }}
                                        size="small"
                                        variant="secondary"
                                    >
                                        Åpne
                                    </Button>
                                )}
                            </Table.DataCell>
                        </Table.Row>
                    ))}
            </Table.Body>
        </Table>
    );
};
