import { Button, Table } from '@navikt/ds-react';
import { formaterMeldeperiode } from '~/utils/date';
import { formatterBeløp } from '~/utils/beløp';
import {
    brukersMeldekortKjedeStatusTekst,
    meldekortbehandlingStatusTekst,
} from '~/lib/meldekort/utils/tekster';
import { meldeperiodeUrl } from '~/utils/urls';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { MeldeperiodekjedeProps } from '~/lib/meldekort/typer/Meldeperiode';

type Props = {
    saksnummer: string;
    meldeperiodeKjeder: MeldeperiodekjedeProps[];
};

export const MeldeperiodeKjederOversikt = ({ saksnummer, meldeperiodeKjeder }: Props) => {
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col" />
                    <Table.HeaderCell scope="col">{'Periode'}</Table.HeaderCell>
                    <Table.HeaderCell scope="col">
                        {'Siste meldekort status (antall)'}
                    </Table.HeaderCell>
                    <Table.HeaderCell scope="col">
                        {'Siste behandling status (antall)'}
                    </Table.HeaderCell>
                    <Table.HeaderCell scope="col">{'Tiltak'}</Table.HeaderCell>
                    <Table.HeaderCell scope="col">{'Beregnet beløp'}</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {meldeperiodeKjeder
                    .toSorted((a, b) => (a.periode.fraOgMed > b.periode.fraOgMed ? -1 : 1))
                    .map((kjede) => {
                        const {
                            id,
                            periode,
                            tiltaksnavn,
                            brukersMeldekortStatus,
                            meldekortbehandlingStatus,
                            gjeldendeBeregning,
                            meldekortbehandlingIder,
                            brukersMeldekort,
                        } = kjede;

                        return (
                            <Table.Row shadeOnHover={false} key={id}>
                                <Table.DataCell>
                                    <Button
                                        as={InternLenke}
                                        href={meldeperiodeUrl(saksnummer, periode)}
                                        variant={'tertiary'}
                                        size={'small'}
                                    >
                                        {'Åpne'}
                                    </Button>
                                </Table.DataCell>
                                <Table.DataCell>{formaterMeldeperiode(periode)}</Table.DataCell>
                                <Table.DataCell>
                                    {`${brukersMeldekortKjedeStatusTekst[brukersMeldekortStatus]} (${brukersMeldekort.length})`}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {meldekortbehandlingStatus
                                        ? `${meldekortbehandlingStatusTekst[meldekortbehandlingStatus]} (${meldekortbehandlingIder.length})`
                                        : 'Ikke behandlet (0)'}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {tiltaksnavn.length > 0 ? tiltaksnavn.join(', ') : '-'}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {gjeldendeBeregning
                                        ? formatterBeløp(gjeldendeBeregning.beløp.totalt)
                                        : '-'}
                                </Table.DataCell>
                            </Table.Row>
                        );
                    })}
            </Table.Body>
        </Table>
    );
};
