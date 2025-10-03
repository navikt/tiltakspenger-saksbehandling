import { SimulertBeregningDag, SimulerteBeløp } from '~/types/SimulertBeregningTypes';
import { Table } from '@navikt/ds-react';
import { classNames } from '~/utils/classNames';
import { formaterDatotekst } from '~/utils/date';
import { ikonForMeldekortBehandlingDagStatus } from '~/components/meldekort/0-felles-komponenter/MeldekortIkoner';
import { meldekortBehandlingDagStatusTekst } from '~/utils/tekstformateringUtils';
import { beløpStyle } from '~/components/utbetaling/beløp/beløpStyle';
import { useState } from 'react';

import style from './SimuleringDetaljerDager.module.css';

type Props = {
    dag: SimulertBeregningDag;
    className?: string;
};

export const SimuleringDetaljerDag = ({ dag, className }: Props) => {
    const [visSimulering, _] = useState(false);

    const { beregning, simulerteBeløp, dato, status } = dag;

    const beregnetDiffDag = beregning.totalt.nå - (beregning.totalt.før ?? 0);

    const simulertDiffDag =
        simulerteBeløp !== null
            ? simulerteBeløp.nyUtbetaling - simulerteBeløp.tidligereUtbetaling
            : undefined;

    return (
        <>
            <Table.Row className={classNames(style.meldeperiodeDag, className)} key={dato}>
                <Table.DataCell>{formaterDatotekst(dato)}</Table.DataCell>
                <Table.DataCell className={style.statusIkon}>
                    {ikonForMeldekortBehandlingDagStatus[status]}
                </Table.DataCell>
                <Table.DataCell>{meldekortBehandlingDagStatusTekst[status]}</Table.DataCell>
                <Table.DataCell>{beregning.ordinært.før}</Table.DataCell>
                <Table.DataCell>
                    <strong>{beregning.ordinært.nå}</strong>
                </Table.DataCell>
                <Table.DataCell>{beregning.barnetillegg.før}</Table.DataCell>
                <Table.DataCell>
                    <strong>{beregning.barnetillegg.nå}</strong>
                </Table.DataCell>
                <Table.DataCell>{beregning.totalt.før}</Table.DataCell>
                <Table.DataCell>
                    <strong>{beregning.totalt.nå}</strong>
                </Table.DataCell>
                <Table.DataCell className={beløpStyle(beregnetDiffDag)}>
                    {beregnetDiffDag}
                </Table.DataCell>
                <Table.DataCell className={beløpStyle(simulertDiffDag)}>
                    {simulertDiffDag ?? '-'}
                </Table.DataCell>
                {visSimulering && simulerteBeløp && (
                    <SimuleringRow simulerteBeløp={simulerteBeløp} />
                )}
            </Table.Row>
        </>
    );
};

const SimuleringRow = ({ simulerteBeløp }: { simulerteBeløp: SimulerteBeløp }) => {
    return (
        <Table.Row>
            <Table.DataCell colSpan={3} />
            <Table.DataCell
                colSpan={8}
            >{`Simulering detaljer goes here! ${simulerteBeløp.nyUtbetaling} osv`}</Table.DataCell>
        </Table.Row>
    );
};
