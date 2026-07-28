import {
    SimuleringResultat,
    SimulertBeregning,
} from '~/lib/beregning-og-simulering/typer/SimulertBeregning';
import { Button, VStack } from '@navikt/ds-react';
import { useState } from 'react';
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
                <SimulertBeregningDetaljerTabell simulertBeregning={simulertBeregning} />
            </div>
        </>
    );
};

export const SimulertBeregningDetaljerTabell = ({ simulertBeregning, className }: Props) => {
    const { meldeperioder, simuleringResultat } = simulertBeregning;

    return (
        <VStack gap={'space-16'} className={className}>
            {meldeperioder.map((meldeperiode) => (
                <SimulertBeregningMeldeperiodeDetaljer
                    meldeperiode={meldeperiode}
                    harSimulering={simuleringResultat !== SimuleringResultat.IKKE_SIMULERT}
                    key={meldeperiode.kjedeId}
                />
            ))}
        </VStack>
    );
};
