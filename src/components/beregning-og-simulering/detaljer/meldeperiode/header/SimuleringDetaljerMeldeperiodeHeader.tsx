import { Alert, BodyShort, Button } from '@navikt/ds-react';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { classNames } from '~/utils/classNames';
import { formatterBeløp } from '~/utils/beløp';
import { beløpStyle } from '~/components/utbetaling/beløp/beløpStyle';
import { periodeTilFormatertDatotekst, ukenummerFraDatotekst } from '~/utils/date';
import { Periode } from '~/types/Periode';

import style from './SimuleringDetaljerMeldeperiodeHeader.module.css';

type Props = {
    periode: Periode;
    beregnetDiff: number;
    simulertDiff?: number;
    erÅpen: boolean;
    setErÅpen: (erÅpen: boolean) => void;
};

export const SimuleringDetaljerMeldeperiodeHeader = ({
    periode,
    beregnetDiff,
    simulertDiff,
    erÅpen,
    setErÅpen,
}: Props) => {
    const beregningOgSimuleringAvviker =
        simulertDiff !== undefined && beregnetDiff !== simulertDiff;

    const periodeString = periodeTilFormatertDatotekst(periode);
    const ukerString = `${ukenummerFraDatotekst(periode.fraOgMed)} og ${ukenummerFraDatotekst(periode.tilOgMed)}`;

    return (
        <div className={style.header}>
            <Button
                data-color="neutral"
                onClick={() => setErÅpen(!erÅpen)}
                variant={'tertiary'}
                size={'medium'}
                type={'button'}
                icon={
                    <ChevronDownIcon
                        className={classNames(style.knappIkon, erÅpen && style.ikonÅpen)}
                    />
                }
                className={style.knapp}
            >{`Meldeperiode uke ${ukerString} (${periodeString})`}</Button>
            <div className={style.headerBeregning}>
                {beregningOgSimuleringAvviker ? (
                    <Alert variant={'warning'} size={'small'}>
                        {'Simulert utbetaling '}
                        <strong>{formatterBeløp(simulertDiff)}</strong>
                        {' avviker fra vår beregning '}
                        <strong>{formatterBeløp(beregnetDiff)}</strong>
                    </Alert>
                ) : (
                    <>
                        <BodyShort>{`Beregnet endring: `}</BodyShort>
                        <strong className={beløpStyle(beregnetDiff)}>
                            {formatterBeløp(beregnetDiff)}
                        </strong>
                    </>
                )}
            </div>
        </div>
    );
};
