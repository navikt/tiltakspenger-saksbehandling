import { Table } from '@navikt/ds-react';
import { SimulertBeregningPerMeldeperiode } from '~/types/SimulertBeregningTypes';
import { classNames } from '~/utils/classNames';
import { useState } from 'react';
import { SimuleringOppsummeringDetaljert } from '~/components/beregning-og-simulering/detaljer/meldeperiode/oppsummering/SimuleringOppsummeringDetaljert';
import { beløpStyle } from '~/components/utbetaling/beløp/beløpStyle';
import { SimuleringDetaljerDag } from '~/components/beregning-og-simulering/detaljer/meldeperiode/dag/SimuleringDetaljerDag';
import { SimuleringDetaljerMeldeperiodeHeader } from '~/components/beregning-og-simulering/detaljer/meldeperiode/header/SimuleringDetaljerMeldeperiodeHeader';

import style from './SimuleringDetaljerMeldeperiode.module.css';

type Props = {
    meldeperiode: SimulertBeregningPerMeldeperiode;
};

export const SimuleringDetaljerMeldeperiode = ({ meldeperiode }: Props) => {
    const [erÅpen, setErÅpen] = useState(false);

    const { dager, beregning, simulerteBeløp } = meldeperiode;
    const { totalt, ordinært, barnetillegg } = beregning;

    const beregnetDiff = totalt.nå - (totalt.før ?? 0);
    const simulertDiff = simulerteBeløp
        ? simulerteBeløp.nyUtbetaling - simulerteBeløp.tidligereUtbetaling
        : undefined;

    const periode = {
        fraOgMed: dager.at(0)!.dato,
        tilOgMed: dager.at(-1)!.dato,
    };

    const kanLukkesStyle = !erÅpen ? style.lukket : undefined;

    return (
        <>
            <Table.Row shadeOnHover={false}>
                <Table.HeaderCell colSpan={11} className={style.headerCell}>
                    <SimuleringDetaljerMeldeperiodeHeader
                        periode={periode}
                        beregnetDiff={beregnetDiff}
                        simulertDiff={simulertDiff}
                        erÅpen={erÅpen}
                        setErÅpen={setErÅpen}
                    />
                </Table.HeaderCell>
            </Table.Row>

            <Table.Row
                shadeOnHover={false}
                className={classNames(style.tabellHeaderOver, kanLukkesStyle)}
            >
                <Table.HeaderCell>{'Dato'}</Table.HeaderCell>
                <Table.HeaderCell colSpan={2}>{'Status'}</Table.HeaderCell>
                <Table.HeaderCell colSpan={2}>{'Ordinær'}</Table.HeaderCell>
                <Table.HeaderCell colSpan={2}>{'Barnetillegg'}</Table.HeaderCell>
                <Table.HeaderCell colSpan={2}>{'Totalt'}</Table.HeaderCell>
                <Table.HeaderCell colSpan={2}>{'Endring'}</Table.HeaderCell>
            </Table.Row>

            <Table.Row
                shadeOnHover={false}
                className={classNames(style.tabellHeaderUnder, kanLukkesStyle)}
            >
                <Table.HeaderCell colSpan={3} />
                <Table.HeaderCell>{'Før'}</Table.HeaderCell>
                <Table.HeaderCell>{'Nå'}</Table.HeaderCell>
                <Table.HeaderCell>{'Før'}</Table.HeaderCell>
                <Table.HeaderCell>{'Nå'}</Table.HeaderCell>
                <Table.HeaderCell>{'Før'}</Table.HeaderCell>
                <Table.HeaderCell>{'Nå'}</Table.HeaderCell>
                <Table.HeaderCell>{'Beregnet'}</Table.HeaderCell>
                <Table.HeaderCell className={style.endringOgVisMerCell}>
                    {'Simulert'}
                </Table.HeaderCell>
            </Table.Row>

            {dager.map((dag) => (
                <SimuleringDetaljerDag dag={dag} className={kanLukkesStyle} key={dag.dato} />
            ))}

            <Table.Row className={classNames(style.periodeSum, kanLukkesStyle)}>
                <Table.DataCell colSpan={3}>
                    <strong>{'Sum for periodeSpm'}</strong>
                </Table.DataCell>
                <Table.DataCell>{ordinært.før}</Table.DataCell>
                <Table.DataCell>
                    <strong>{ordinært.nå}</strong>
                </Table.DataCell>
                <Table.DataCell>{barnetillegg.før}</Table.DataCell>
                <Table.DataCell>
                    <strong>{barnetillegg.nå}</strong>
                </Table.DataCell>
                <Table.DataCell>{totalt.før}</Table.DataCell>
                <Table.DataCell>
                    <strong>{totalt.nå}</strong>
                </Table.DataCell>
                <Table.DataCell className={beløpStyle(beregnetDiff)}>
                    <strong>{beregnetDiff}</strong>
                </Table.DataCell>
                <Table.DataCell className={beløpStyle(simulertDiff)}>
                    <strong>{simulertDiff ?? '-'}</strong>
                </Table.DataCell>
            </Table.Row>

            <Table.Row shadeOnHover={false} className={kanLukkesStyle}>
                <Table.DataCell colSpan={11} className={style.simuleringCell}>
                    <SimuleringOppsummeringDetaljert
                        headerTekst={'Simulering for hele perioden'}
                        simulerteBeløp={meldeperiode.simulerteBeløp}
                    />
                </Table.DataCell>
            </Table.Row>
        </>
    );
};
