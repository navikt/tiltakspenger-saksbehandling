import { SimuleringResultat, SimulertBeregning } from '~/types/SimulertBeregning';
import { Button, Table } from '@navikt/ds-react';
import { Fragment, useState } from 'react';
import { classNames } from '~/utils/classNames';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { SimulertBeregningMeldeperiodeDetaljer } from '~/lib/beregning-og-simulering/detaljer/meldeperiode/SimulertBeregningMeldeperiodeDetaljer';

import style from './SimulertBeregningDetaljer.module.css';

type Props = {
    simulertBeregning: SimulertBeregning;
    className?: string;
};

export const SimulertBeregningDetaljer = ({ simulertBeregning, className }: Props) => {
    const [åpen, setÅpen] = useState(false);

    const { meldeperioder, simuleringResultat } = simulertBeregning;

    return (
        <>
            <Button
                onClick={() => setÅpen(!åpen)}
                variant={'tertiary'}
                size={'small'}
                type={'button'}
                icon={
                    <ChevronDownIcon
                        className={classNames(style.detaljerKnappIkon, åpen && style.åpen)}
                    />
                }
                className={style.detaljerKnapp}
            >
                {`${åpen ? 'Skjul' : 'Vis'} detaljer`}
            </Button>

            <div className={classNames(style.detaljer, åpen && style.åpen, className)}>
                <Table size={'small'}>
                    <Table.Body>
                        {meldeperioder.map((meldeperiode, index) => (
                            <Fragment key={meldeperiode.kjedeId}>
                                <SimulertBeregningMeldeperiodeDetaljer
                                    meldeperiode={meldeperiode}
                                    harSimulering={
                                        simuleringResultat !== SimuleringResultat.IKKE_SIMULERT
                                    }
                                />
                                {index < meldeperioder.length - 1 && (
                                    <Table.Row className={style.spacer} shadeOnHover={false}>
                                        <Table.DataCell />
                                    </Table.Row>
                                )}
                            </Fragment>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        </>
    );
};
