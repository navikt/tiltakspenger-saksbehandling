import { SimulertBeregningDag } from '~/types/SimulertBeregningTypes';
import { Table } from '@navikt/ds-react';
import { classNames } from '~/utils/classNames';
import { formaterDatotekst } from '~/utils/date';
import { ikonForMeldekortBehandlingDagStatus } from '~/components/meldekort/0-felles-komponenter/MeldekortIkoner';
import { meldekortBehandlingDagStatusTekst } from '~/utils/tekstformateringUtils';
import { beløpStyle } from '~/components/utbetaling/beløp/beløpStyle';

import style from './SimuleringDetaljerDager.module.css';

type Props = {
    dager: SimulertBeregningDag[];
    className?: string;
};

export const SimuleringDetaljerDager = ({ dager, className }: Props) => {
    return dager.map((dag) => {
        const beregnetDiffDag = dag.beregning.totalt.nå - (dag.beregning.totalt.før ?? 0);

        const simulertDiffDag =
            dag.simulerteBeløp !== null
                ? dag.simulerteBeløp.nyUtbetaling - dag.simulerteBeløp.tidligereUtbetaling
                : undefined;

        return (
            <Table.Row className={classNames(style.meldeperiodeDag, className)} key={dag.dato}>
                <Table.DataCell>{formaterDatotekst(dag.dato)}</Table.DataCell>
                <Table.DataCell className={style.statusIkon}>
                    {ikonForMeldekortBehandlingDagStatus[dag.status]}
                </Table.DataCell>
                <Table.DataCell>{meldekortBehandlingDagStatusTekst[dag.status]}</Table.DataCell>
                <Table.DataCell>{dag.beregning.ordinært.før}</Table.DataCell>
                <Table.DataCell>
                    <strong>{dag.beregning.ordinært.nå}</strong>
                </Table.DataCell>
                <Table.DataCell>{dag.beregning.barnetillegg.før}</Table.DataCell>
                <Table.DataCell>
                    <strong>{dag.beregning.barnetillegg.nå}</strong>
                </Table.DataCell>
                <Table.DataCell>{dag.beregning.totalt.før}</Table.DataCell>
                <Table.DataCell>
                    <strong>{dag.beregning.totalt.nå}</strong>
                </Table.DataCell>
                <Table.DataCell className={beløpStyle(beregnetDiffDag)}>
                    {beregnetDiffDag}
                </Table.DataCell>
                <Table.DataCell className={beløpStyle(simulertDiffDag)}>
                    {simulertDiffDag ?? '-'}
                </Table.DataCell>
            </Table.Row>
        );
    });
};
