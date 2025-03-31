import { Button, Table } from '@navikt/ds-react';
import { finnMeldeperiodeKjedeStatusTekst } from '../../../utils/tekstformateringUtils';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '../../../utils/date';
import Link from 'next/link';
import {
    MeldeperiodeKjedeProps,
    MeldeperiodeKjedeStatus,
} from '../../../types/meldekort/Meldeperiode';
import { meldeperiodeUrl } from '../../../utils/urls';

import style from './MeldekortOversikt.module.css';

type Props = {
    meldeperiodeKjeder: MeldeperiodeKjedeProps[];
    saksnummer: string;
};

export const MeldekortOversikt = ({ meldeperiodeKjeder, saksnummer }: Props) => {
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Mottatt fra bruker</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Beslutter</Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {meldeperiodeKjeder
                    .toSorted((a, b) => (a.periode.fraOgMed > b.periode.fraOgMed ? -1 : 1))
                    .map((kjede) => {
                        const { meldekortBehandlinger, id, status, periode, brukersMeldekort } =
                            kjede;

                        const sisteMeldekortBehandling = meldekortBehandlinger.at(-1);

                        return (
                            <Table.Row shadeOnHover={false} key={id}>
                                <Table.DataCell>
                                    {finnMeldeperiodeKjedeStatusTekst[status]}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {periodeTilFormatertDatotekst(periode)}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {brukersMeldekort
                                        ? formaterTidspunkt(brukersMeldekort.mottatt)
                                        : 'Ikke mottatt'}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {sisteMeldekortBehandling?.saksbehandler ?? '-'}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {sisteMeldekortBehandling?.beslutter ?? '-'}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {status !==
                                        MeldeperiodeKjedeStatus.IKKE_KLAR_TIL_BEHANDLING && (
                                        <Button
                                            as={Link}
                                            href={meldeperiodeUrl(saksnummer, periode)}
                                            size="small"
                                            variant="secondary"
                                            className={style.knapp}
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
