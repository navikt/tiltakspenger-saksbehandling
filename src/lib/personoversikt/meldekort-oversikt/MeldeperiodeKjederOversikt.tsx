import { Checkbox, Table, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { formaterMeldeperiode } from '~/utils/date';
import { formatterBeløp } from '~/utils/beløp';
import {
    brukersMeldekortKjedeStatusTekst,
    meldekortbehandlingStatusTekst,
} from '~/lib/meldekort/utils/tekster';
import { meldeperiodeUrl } from '~/utils/urls';
import { MeldeperiodekjedeProps } from '~/lib/meldekort/typer/Meldeperiode';
import { SeBehandlingKnapp } from '~/lib/behandling-felles/behandlingmeny/SeBehandlingKnapp';

import style from './MeldeperiodeKjederOversikt.module.css';

type Props = {
    saksnummer: string;
    meldeperiodeKjeder: MeldeperiodekjedeProps[];
};

export const MeldeperiodeKjederOversikt = ({ saksnummer, meldeperiodeKjeder }: Props) => {
    const [visIkkeKlare, setVisIkkeKlare] = useState(false);

    const antallIkkeKlare = meldeperiodeKjeder.filter((kjede) => !kjede.erKlarTilUtfylling).length;

    const synligeKjeder = visIkkeKlare
        ? meldeperiodeKjeder
        : meldeperiodeKjeder.filter((kjede) => kjede.erKlarTilUtfylling);

    return (
        <VStack gap={'space-8'}>
            {antallIkkeKlare > 0 && (
                <Checkbox
                    size={'small'}
                    checked={visIkkeKlare}
                    onChange={(e) => setVisIkkeKlare(e.target.checked)}
                >
                    {`Vis meldeperioder som ikke er klare til behandling (${antallIkkeKlare})`}
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
                                erKlarTilUtfylling,
                            } = kjede;

                            const { antallDager, ingenDagerGirRett } = sisteMeldeperiode;

                            return (
                                <Table.Row
                                    shadeOnHover={false}
                                    key={id}
                                    className={erKlarTilUtfylling ? undefined : style.ikkeKlarRad}
                                >
                                    <Table.DataCell>{`${formaterMeldeperiode(periode)}${erKlarTilUtfylling ? '' : ' (ikke klar)'}`}</Table.DataCell>
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
                                        {`${antallDager} dag${antallDager !== 1 ? 'er' : ''}`}
                                        {ingenDagerGirRett && ' (ikke rett)'}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {gjeldendeBeregning
                                            ? formatterBeløp(gjeldendeBeregning.beløp.totalt)
                                            : '-'}
                                    </Table.DataCell>
                                    <Table.DataCell align={'right'}>
                                        <SeBehandlingKnapp
                                            href={meldeperiodeUrl(saksnummer, periode)}
                                        >
                                            {'Se oversikt'}
                                        </SeBehandlingKnapp>
                                    </Table.DataCell>
                                </Table.Row>
                            );
                        })}
                </Table.Body>
            </Table>
        </VStack>
    );
};
