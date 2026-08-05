import { Checkbox, Table, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { formaterMeldeperiode } from '~/utils/date';
import { formatterBeløp } from '~/utils/beløp';
import { brukersMeldekortKjedeStatusTekst } from '~/lib/meldekort/utils/tekster';
import { behandlingsstatusTekst } from '~/lib/behandling-felles/status/behandlingsstatus';
import { meldeperiodeUrl } from '~/utils/urls';
import { MeldeperiodekjedeProps, KanIkkeBehandlesGrunn } from '~/lib/meldekort/typer/Meldeperiode';
import { TilBehandlingKnapp } from '~/lib/personoversikt/TilBehandlingKnapp';

import style from './MeldeperiodeKjederOversikt.module.css';

type Props = {
    saksnummer: string;
    meldeperiodeKjeder: MeldeperiodekjedeProps[];
};

export const MeldeperiodeKjederOversikt = ({ saksnummer, meldeperiodeKjeder }: Props) => {
    const [visIkkeStartede, setVisIkkeStartede] = useState(false);

    const antallIkkeStartede = meldeperiodeKjeder.filter(harIkkeStartet).length;

    const synligeKjeder = visIkkeStartede
        ? meldeperiodeKjeder
        : meldeperiodeKjeder.filter((kjede) => !harIkkeStartet(kjede));

    return (
        <VStack gap={'space-8'}>
            {antallIkkeStartede > 0 && (
                <Checkbox
                    size={'small'}
                    checked={visIkkeStartede}
                    onChange={(e) => setVisIkkeStartede(e.target.checked)}
                >
                    {`Vis meldeperioder som ikke har startet (${antallIkkeStartede})`}
                </Checkbox>
            )}

            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col">{'Periode'}</Table.HeaderCell>
                        <Table.HeaderCell scope="col">
                            {'Siste meldekort status (antall)'}
                        </Table.HeaderCell>
                        <Table.HeaderCell scope="col">
                            {'Siste behandling status (antall)'}
                        </Table.HeaderCell>
                        <Table.HeaderCell scope="col">{'Tiltak'}</Table.HeaderCell>
                        <Table.HeaderCell scope="col">{'Tiltaksdager'}</Table.HeaderCell>
                        <Table.HeaderCell scope="col">{'Beregnet beløp'}</Table.HeaderCell>
                        <Table.HeaderCell scope="col" />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {synligeKjeder
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
                                sisteMeldeperiode,
                            } = kjede;

                            const { antallDager, ingenDagerGirRett } = sisteMeldeperiode;

                            const ikkeStartet = harIkkeStartet(kjede);

                            return (
                                <Table.Row
                                    shadeOnHover={false}
                                    key={id}
                                    className={ikkeStartet ? style.ikkeStartetRad : undefined}
                                >
                                    <Table.DataCell>{`${formaterMeldeperiode(periode)}${ikkeStartet ? ' (ikke startet)' : ''}`}</Table.DataCell>
                                    <Table.DataCell>
                                        {`${brukersMeldekortKjedeStatusTekst[brukersMeldekortStatus]} (${brukersMeldekort.length})`}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {meldekortbehandlingStatus
                                            ? `${behandlingsstatusTekst(meldekortbehandlingStatus)} (${meldekortbehandlingIder.length})`
                                            : 'Ikke behandlet (0)'}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {tiltaksnavn.length > 0 ? tiltaksnavn.join(', ') : '-'}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {`${antallDager} dag${antallDager !== 1 ? 'er' : ''}`}
                                        {ingenDagerGirRett && ' (ikke rett)'}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {gjeldendeBeregning
                                            ? formatterBeløp(gjeldendeBeregning.beløp.totalt)
                                            : '-'}
                                    </Table.DataCell>
                                    <Table.DataCell align={'right'}>
                                        <TilBehandlingKnapp
                                            href={meldeperiodeUrl(saksnummer, periode)}
                                        >
                                            {'Se oversikt'}
                                        </TilBehandlingKnapp>
                                    </Table.DataCell>
                                </Table.Row>
                            );
                        })}
                </Table.Body>
            </Table>
        </VStack>
    );
};

const harIkkeStartet = ({ kanIkkeBehandlesGrunn }: MeldeperiodekjedeProps): boolean =>
    kanIkkeBehandlesGrunn === KanIkkeBehandlesGrunn.MELDEPERIODEN_HAR_IKKE_STARTET;
