import { Table } from '@navikt/ds-react';
import { formaterMeldeperiode } from '~/utils/date';
import { formatterBeløp } from '~/utils/beløp';
import { MeldeperiodeKjedePropsV2 } from '~/lib/meldekort/v2/typer';
import {
    brukersMeldekortKjedeStatusTekst,
    meldekortbehandlingStatusTekst,
} from '~/lib/meldekort/v2/tekster';
import { meldeperiodeUrl } from '~/utils/urls';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';

type Props = {
    saksnummer: string;
    meldeperiodeKjeder: MeldeperiodeKjedePropsV2[];
};

export const MeldeperiodeKjederTabellV2 = ({ saksnummer, meldeperiodeKjeder }: Props) => {
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col" />
                    <Table.HeaderCell scope="col">{'Periode'}</Table.HeaderCell>
                    <Table.HeaderCell scope="col">{'Status meldekort (antall)'}</Table.HeaderCell>
                    <Table.HeaderCell scope="col">{'Status behandling (antall)'}</Table.HeaderCell>
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
                                    <InternLenke href={meldeperiodeUrl(saksnummer, periode)}>
                                        {'Se mer'}
                                    </InternLenke>
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
