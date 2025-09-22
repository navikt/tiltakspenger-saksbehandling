import { SimulertBeregning } from '~/types/SimulertBeregningTypes';
import { Button, Table, VStack } from '@navikt/ds-react';
import React, { Fragment, useState } from 'react';

import style from './SimuleringDetaljer.module.css';
import { classNames } from '~/utils/classNames';
import { TableHeader } from '@navikt/ds-react/Table';
import { formaterDatotekst, periodeTilFormatertDatotekst } from '~/utils/date';
import {
    brukersMeldekortDagStatusTekst,
    meldekortBehandlingDagStatusTekst,
} from '~/utils/tekstformateringUtils';

type Props = {
    simulertBeregning: SimulertBeregning;
};

export const SimuleringDetaljer = ({ simulertBeregning }: Props) => {
    const [åpen, setÅpen] = useState(false);

    const { perMeldeperiode } = simulertBeregning;

    return (
        <>
            <Button
                onClick={() => setÅpen(!åpen)}
                variant={'tertiary'}
                size={'small'}
                type={'button'}
            >
                {`${åpen ? 'Skjul' : 'Vis'} detaljer for simulering`}
            </Button>
            <VStack className={classNames(style.detaljer, åpen && style.åpen)}>
                <Table size={'small'} className={style.tabell} >
                    <Table.Header className={style.tabellHeader}>
                        <Table.Row>
                            <Table.HeaderCell>Dato</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell colSpan={2}>Ordinær</Table.HeaderCell>
                            <Table.HeaderCell colSpan={2}>Barnetillegg</Table.HeaderCell>
                            <Table.HeaderCell>Utbetaling</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {perMeldeperiode.map((meldeperiode) => {
                            const { dager, meldeperiodeKjedeId } = meldeperiode;

                            const periodeString = periodeTilFormatertDatotekst({
                                fraOgMed: dager.at(0)!.dato,
                                tilOgMed: dager.at(-1)!.dato,
                            });

                            return (
                                <Fragment>
                                    <Table.Row>
                                        <Table.DataCell
                                            colSpan={7}
                                            className={style.meldeperiodeHeader}
                                        >
                                            {`${periodeString}`}
                                        </Table.DataCell>
                                    </Table.Row>
                                    {dager.map((dag) => (
                                        <Table.Row className={style.meldeperiodeDag}>
                                            <Table.DataCell>
                                                {formaterDatotekst(dag.dato)}
                                            </Table.DataCell>
                                            <Table.DataCell>
                                                {meldekortBehandlingDagStatusTekst[dag.status]}
                                            </Table.DataCell>
                                            <Table.DataCell>{dag.beregning.ordinært.før}</Table.DataCell>
                                            <Table.DataCell className={style.bold}>{dag.beregning.ordinært.nå}</Table.DataCell>
                                            <Table.DataCell>{dag.beregning.barnetillegg.før}</Table.DataCell>
                                            <Table.DataCell className={style.bold}>{dag.beregning.barnetillegg.nå}</Table.DataCell>
                                            <Table.DataCell>{dag.simuleringNyUtbetaling}</Table.DataCell>
                                        </Table.Row>
                                    ))}
                                </Fragment>
                            );
                        })}
                    </Table.Body>
                </Table>
            </VStack>
        </>
    );
};
