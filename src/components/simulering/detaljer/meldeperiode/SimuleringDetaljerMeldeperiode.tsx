import { ChevronDownIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, Table } from '@navikt/ds-react';
import { SimulertBeregningPerMeldeperiode } from '~/types/SimulertBeregningTypes';
import {
    formaterDatotekst,
    periodeTilFormatertDatotekst,
    ukenummerFraDatotekst,
} from '~/utils/date';
import { ikonForMeldekortBehandlingDagStatus } from '~/components/meldekort/0-felles-komponenter/MeldekortIkoner';
import { meldekortBehandlingDagStatusTekst } from '~/utils/tekstformateringUtils';
import { classNames } from '~/utils/classNames';
import { useState } from 'react';
import { formatterBeløp } from '~/utils/beløp';

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

    const beregningOgSimuleringAvviker =
        simulertDiff !== undefined && beregnetDiff !== simulertDiff;

    const periode = {
        fraOgMed: dager.at(0)!.dato,
        tilOgMed: dager.at(-1)!.dato,
    };

    const periodeString = periodeTilFormatertDatotekst(periode);
    const ukerString = `${ukenummerFraDatotekst(periode.fraOgMed)} og ${ukenummerFraDatotekst(periode.tilOgMed)}`;

    return (
        <>
            <Table.Row shadeOnHover={false}>
                <Table.HeaderCell colSpan={11} className={style.headerCell}>
                    <div className={style.header}>
                        <Button
                            onClick={() => setErÅpen(!erÅpen)}
                            variant={'tertiary-neutral'}
                            size={'medium'}
                            type={'button'}
                            icon={
                                <ChevronDownIcon
                                    className={classNames(
                                        style.knappIkon,
                                        erÅpen && style.ikonÅpen,
                                    )}
                                />
                            }
                            className={style.knapp}
                        >{`Meldeperiode uke ${ukerString} (${periodeString})`}</Button>
                        <div className={style.headerBeregning}>
                            {beregningOgSimuleringAvviker ? (
                                <Alert variant={'warning'} size={'small'}>
                                    {'Simulert utbetaling '}
                                    <span className={style.bold}>
                                        {formatterBeløp(simulertDiff)}
                                    </span>
                                    {' avviker fra vår beregning '}
                                    <span className={style.bold}>
                                        {formatterBeløp(beregnetDiff)}
                                    </span>
                                </Alert>
                            ) : (
                                <>
                                    <BodyShort>{`Beregnet endring: `}</BodyShort>
                                    <BodyShort
                                        weight={'semibold'}
                                        className={classNames(styleForBeløp(beregnetDiff))}
                                    >
                                        {formatterBeløp(beregnetDiff)}
                                    </BodyShort>
                                </>
                            )}
                        </div>
                    </div>
                </Table.HeaderCell>
            </Table.Row>

            <Table.Row
                shadeOnHover={false}
                className={classNames(style.tabellHeaderOver, !erÅpen && style.lukket)}
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
                className={classNames(style.tabellHeaderUnder, !erÅpen && style.lukket)}
            >
                <Table.HeaderCell colSpan={3} />
                <Table.HeaderCell>{'Før'}</Table.HeaderCell>
                <Table.HeaderCell>{'Nå'}</Table.HeaderCell>
                <Table.HeaderCell>{'Før'}</Table.HeaderCell>
                <Table.HeaderCell>{'Nå'}</Table.HeaderCell>
                <Table.HeaderCell>{'Før'}</Table.HeaderCell>
                <Table.HeaderCell>{'Nå'}</Table.HeaderCell>
                <Table.HeaderCell>{'Beregnet'}</Table.HeaderCell>
                <Table.HeaderCell>{'Simulert'}</Table.HeaderCell>
            </Table.Row>

            {dager.map((dag) => {
                const beregnetDiffDag = dag.beregning.totalt.nå - (dag.beregning.totalt.før ?? 0);

                const simulertDiffDag =
                    dag.simulerteBeløp !== null
                        ? dag.simulerteBeløp.nyUtbetaling - dag.simulerteBeløp.tidligereUtbetaling
                        : undefined;

                console.log(simulertDiffDag, dag.simulerteBeløp);

                return (
                    <Table.Row
                        className={classNames(style.meldeperiodeDag, !erÅpen && style.lukket)}
                        key={dag.dato}
                    >
                        <Table.DataCell>{formaterDatotekst(dag.dato)}</Table.DataCell>
                        <Table.DataCell className={style.statusIkon}>
                            {ikonForMeldekortBehandlingDagStatus[dag.status]}
                        </Table.DataCell>
                        <Table.DataCell>
                            {meldekortBehandlingDagStatusTekst[dag.status]}
                        </Table.DataCell>
                        <Table.DataCell>{dag.beregning.ordinært.før}</Table.DataCell>
                        <Table.DataCell className={style.bold}>
                            {dag.beregning.ordinært.nå}
                        </Table.DataCell>
                        <Table.DataCell>{dag.beregning.barnetillegg.før}</Table.DataCell>
                        <Table.DataCell className={style.bold}>
                            {dag.beregning.barnetillegg.nå}
                        </Table.DataCell>
                        <Table.DataCell>{dag.beregning.totalt.før}</Table.DataCell>
                        <Table.DataCell className={style.bold}>
                            {dag.beregning.totalt.nå}
                        </Table.DataCell>
                        <Table.DataCell className={classNames(styleForBeløp(beregnetDiffDag))}>
                            {beregnetDiffDag}
                        </Table.DataCell>
                        <Table.DataCell className={classNames(styleForBeløp(simulertDiffDag))}>
                            {simulertDiffDag ?? '-'}
                        </Table.DataCell>
                    </Table.Row>
                );
            })}

            <Table.Row className={classNames(style.periodeSum, !erÅpen && style.lukket)}>
                <Table.DataCell className={style.bold} colSpan={3}>
                    {'Sum for periode'}
                </Table.DataCell>
                <Table.DataCell>{ordinært.før}</Table.DataCell>
                <Table.DataCell className={style.bold}>{ordinært.nå}</Table.DataCell>
                <Table.DataCell>{barnetillegg.før}</Table.DataCell>
                <Table.DataCell className={style.bold}>{barnetillegg.nå}</Table.DataCell>
                <Table.DataCell>{totalt.før}</Table.DataCell>
                <Table.DataCell className={style.bold}>{totalt.nå}</Table.DataCell>
                <Table.DataCell className={classNames(styleForBeløp(beregnetDiff), style.bold)}>
                    {beregnetDiff}
                </Table.DataCell>
                <Table.DataCell className={classNames(styleForBeløp(simulertDiff), style.bold)}>
                    {simulertDiff ?? '-'}
                </Table.DataCell>
            </Table.Row>
        </>
    );
};

const styleForBeløp = (beløp?: number) => {
    return !beløp ? undefined : beløp > 0 ? style.positiv : style.negativ;
};
