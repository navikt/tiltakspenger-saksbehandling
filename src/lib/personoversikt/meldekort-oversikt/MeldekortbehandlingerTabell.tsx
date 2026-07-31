import { HStack, Table } from '@navikt/ds-react';
import { formaterTidspunkt } from '~/utils/date';
import { formatterBeløp } from '~/utils/beløp';
import { utbetalingsstatusTekst } from '~/utils/tekstformateringUtils';
import { meldekortbehandlingUrl } from '~/utils/urls';
import { MeldekortbehandlingProps } from '~/lib/meldekort/typer/Meldekortbehandling';
import { formaterMeldeperioder } from '~/lib/meldekort/utils/meldekortbehandlingUtils';
import { SeBehandlingKnapp } from '~/lib/behandling-felles/behandlingmeny/SeBehandlingKnapp';
import { MeldekortbehandlingStatusTags } from '~/lib/meldekort/meldekortbehandling/header/behandling-status/MeldekortbehandlingStatusTags';
import { MeldekortbehandlingMeny } from '~/lib/meldekort/felles/meny/MeldekortbehandlingMeny';

type Props = {
    saksnummer: string;
    meldekortbehandlinger: MeldekortbehandlingProps[];
    medMeny: boolean;
};

export const MeldekortbehandlingerTabell = ({
    saksnummer,
    meldekortbehandlinger,
    medMeny,
}: Props) => {
    return (
        <Table>
            <Table.Header>
                <Table.Row>
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
                        const { id, utbetalingsstatus, saksbehandler, beslutter, opprettet } =
                            meldekortbehandling;

                        const beregnetBeløp = beregnetBeløpForBehandling(meldekortbehandling);

                        return (
                            <Table.Row shadeOnHover={false} key={id}>
                                <Table.DataCell>
                                    {formaterMeldeperioder(meldekortbehandling)}
                                </Table.DataCell>
                                <Table.DataCell>
                                    <MeldekortbehandlingStatusTags
                                        meldekortbehandling={meldekortbehandling}
                                        kompakt={true}
                                    />
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
                                <Table.DataCell align={'right'}>
                                    <HStack
                                        gap={'space-8'}
                                        justify={'end'}
                                        align={'center'}
                                        wrap={false}
                                    >
                                        <SeBehandlingKnapp
                                            href={meldekortbehandlingUrl(saksnummer, id)}
                                        >
                                            {'Se behandling'}
                                        </SeBehandlingKnapp>

                                        {medMeny && (
                                            <MeldekortbehandlingMeny
                                                meldekortbehandling={meldekortbehandling}
                                                size={'small'}
                                                skalNavigereTilBehandling={true}
                                            />
                                        )}
                                    </HStack>
                                </Table.DataCell>
                            </Table.Row>
                        );
                    })}
            </Table.Body>
        </Table>
    );
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
