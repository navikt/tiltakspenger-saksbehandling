import { Link, Table } from '@navikt/ds-react';
import NextLink from 'next/link';
import { formaterMeldeperiode, formaterTidspunkt } from '~/utils/date';
import { formatterBeløp } from '~/utils/beløp';
import { utbetalingsstatusTekst } from '~/utils/tekstformateringUtils';
import { meldekortbehandlingStatusTekst } from '~/lib/meldekort/utils/tekster';
import { meldekortbehandlingUrl } from '~/utils/urls';
import { MeldekortbehandlingMeny } from '~/lib/meldekort/meldekortbehandling/meny/MeldekortbehandlingMeny';
import { MeldekortbehandlingProps } from '~/lib/meldekort/typer/Meldekortbehandling';

type Props = {
    saksnummer: string;
    meldekortbehandlinger: MeldekortbehandlingProps[];
};

const beregnetBeløpForBehandling = (meldekortbehandling: MeldekortbehandlingProps) => {
    const meldeperioderMedBeregning = meldekortbehandling.meldeperioder.filter(
        (meldeperiode) => meldeperiode.beregning !== null,
    );

    if (meldeperioderMedBeregning.length === 0) {
        return null;
    }

    return meldeperioderMedBeregning.reduce(
        (sum, meldeperiode) => sum + meldeperiode.beregning!.beløp.totalt,
        0,
    );
};

export const MeldekortbehandlingerOversikt = ({ saksnummer, meldekortbehandlinger }: Props) => {
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                    <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Beregnet beløp</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Utbetalingsstatus</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Beslutter</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Opprettet</Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {meldekortbehandlinger
                    .toSorted((a, b) => (a.opprettet > b.opprettet ? -1 : 1))
                    .map((meldekortbehandling) => {
                        const {
                            id,
                            periode,
                            status,
                            utbetalingsstatus,
                            saksbehandler,
                            beslutter,
                            opprettet,
                        } = meldekortbehandling;

                        const beregnetBeløp = beregnetBeløpForBehandling(meldekortbehandling);

                        return (
                            <Table.Row shadeOnHover={false} key={id}>
                                <Table.DataCell>
                                    <Link
                                        as={NextLink}
                                        href={meldekortbehandlingUrl(saksnummer, id)}
                                    >
                                        {'Åpne'}
                                    </Link>
                                </Table.DataCell>
                                <Table.DataCell>{formaterMeldeperiode(periode)}</Table.DataCell>
                                <Table.DataCell>
                                    {meldekortbehandlingStatusTekst[status]}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {beregnetBeløp !== null ? formatterBeløp(beregnetBeløp) : '-'}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {utbetalingsstatusTekst[utbetalingsstatus] ?? '-'}
                                </Table.DataCell>
                                <Table.DataCell>{saksbehandler ?? '-'}</Table.DataCell>
                                <Table.DataCell>{beslutter ?? '-'}</Table.DataCell>
                                <Table.DataCell>{formaterTidspunkt(opprettet)}</Table.DataCell>
                                <Table.DataCell scope="col" align="right">
                                    <MeldekortbehandlingMeny
                                        meldekortbehandling={meldekortbehandling}
                                    />
                                </Table.DataCell>
                            </Table.Row>
                        );
                    })}
            </Table.Body>
        </Table>
    );
};
