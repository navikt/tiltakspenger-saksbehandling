import { Button, Table } from '@navikt/ds-react';
import { finnMeldeperiodeStatusTekst } from '../../../utils/tekstformateringUtils';
import { periodeTilFormatertDatotekst } from '../../../utils/date';
import Link from 'next/link';
import { MeldeperiodeProps, MeldeperiodeStatus } from '../../../types/meldekort/Meldeperiode';

type Props = {
    meldeperioder: MeldeperiodeProps[];
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
                    .toSorted((a, b) => (a.periode.fraOgMed > b.periode.fraOgMed ? -1 : 1))
                    .map((meldeperiode) => {
                        const { meldekortBehandlinger, id, status, periode } = meldeperiode;

                        const sisteMeldekortBehandling = meldekortBehandlinger.at(-1);

                        return (
                            <Table.Row shadeOnHover={false} key={id}>
                                <Table.DataCell>
                                    {finnMeldeperiodeStatusTekst[status]}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {periodeTilFormatertDatotekst(periode)}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {sisteMeldekortBehandling?.saksbehandler ?? '-'}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {sisteMeldekortBehandling?.beslutter ?? '-'}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {status !== MeldeperiodeStatus.IKKE_KLAR_TIL_UTFYLLING && (
                                        <Button
                                            as={Link}
                                            href={`/sak/${saksnummer}/meldeperiode/${periode.fraOgMed}/${periode.tilOgMed}`}
                                            style={{ minWidth: '50%' }}
                                            size="small"
                                            variant="secondary"
                                        >
                                            Åpne
                                        </Button>
                                    )}
                                </Table.DataCell>
                            </Table.Row>
                        );
                    })}
            </Table.Body>
        </Table>
    );
};
