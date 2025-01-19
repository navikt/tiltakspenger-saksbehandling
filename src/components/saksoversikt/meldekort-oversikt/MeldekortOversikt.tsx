import { Meldekortsammendrag, Meldekortstatus } from '../../../types/MeldekortTypes';
import { Button, Table } from '@navikt/ds-react';
import { finnMeldekortstatusTekst } from '../../../utils/tekstformateringUtils';
import { periodeTilFormatertDatotekst } from '../../../utils/date';
import router from 'next/router';

type Props = {
    meldekortsammendrag: Meldekortsammendrag[];
    saksnummer: string;
};

export const MeldekortOversikt = ({ meldekortsammendrag, saksnummer }: Props) => {
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
                {meldekortsammendrag.map((meldekort) => (
                    <Table.Row shadeOnHover={false} key={meldekort.meldekortId}>
                        <Table.DataCell>
                            {finnMeldekortstatusTekst(meldekort.status)}
                        </Table.DataCell>
                        <Table.DataCell>
                            {meldekort.periode &&
                                `${periodeTilFormatertDatotekst(meldekort.periode)}`}
                        </Table.DataCell>
                        <Table.DataCell>{meldekort.saksbehandler ?? '-'}</Table.DataCell>
                        <Table.DataCell>{meldekort.beslutter ?? '-'}</Table.DataCell>
                        <Table.DataCell>
                            {meldekort.status !== Meldekortstatus.IKKE_KLAR_TIL_UTFYLLING && (
                                <Button
                                    style={{ minWidth: '50%' }}
                                    size="small"
                                    variant="secondary"
                                    onClick={() =>
                                        router.push(
                                            `/sak/${saksnummer}/meldekort/${meldekort.meldekortId}`,
                                        )
                                    }
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
