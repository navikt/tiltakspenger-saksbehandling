import { Alert, Heading, VStack } from '@navikt/ds-react';
import { Periode } from '~/types/Periode';
import { periodeTilFormatertDatotekst } from '~/utils/date';
import { UtbetalingStatus } from '~/components/utbetaling/status/UtbetalingStatus';
import { UtbetalingBeløp } from '~/components/utbetaling/beløp/UtbetalingBeløp';
import { Utbetalingsstatus } from '~/types/meldekort/MeldekortBehandling';
import { SimulertBeregning } from '~/types/SimulertBeregningTypes';

import style from './BeregningOgSimuleringHeader.module.css';

type Props = {
    navkontor: string;
    navkontorNavn?: string;
    simulertBeregning: SimulertBeregning;
    utbetalingsstatus?: Utbetalingsstatus;
    visEndringVarsel: boolean;
    className?: string;
};

export const BeregningOgSimuleringHeader = ({
    navkontor,
    navkontorNavn,
    simulertBeregning,
    utbetalingsstatus,
    visEndringVarsel,
    className,
}: Props) => {
    const { meldeperioder, beregning } = simulertBeregning;
    const { totalt } = beregning;

    const periode: Periode = {
        fraOgMed: meldeperioder.at(0)!.dager.at(0)!.dato,
        tilOgMed: meldeperioder.at(-1)!.dager.at(-1)!.dato,
    };

    const totalDiff = totalt.nå - (totalt.før ?? 0);

    const erFeilutbetaling = totalDiff < 0;

    return (
        <VStack gap={'1'} className={className}>
            <Heading size={'small'} level={'3'} className={style.header}>
                {'Utbetaling'}
            </Heading>

            {visEndringVarsel && (
                <Alert
                    variant={'info'}
                    inline={true}
                    size={'small'}
                >{`Vedtaket endrer beregningen av ${meldeperioder.length} meldeperiode i perioden ${periodeTilFormatertDatotekst(periode)}`}</Alert>
            )}

            <UtbetalingBeløp
                tekst={`Beløp til ${erFeilutbetaling ? 'feilutbetaling' : 'etterbetaling'}`}
                beløp={Math.abs(totalDiff)}
                className={erFeilutbetaling ? style.tilbakekrevingBeløp : style.etterbetalingBeløp}
            />

            <UtbetalingStatus
                navkontor={navkontor}
                navkontorNavn={navkontorNavn}
                utbetalingsstatus={utbetalingsstatus}
            />
        </VStack>
    );
};
