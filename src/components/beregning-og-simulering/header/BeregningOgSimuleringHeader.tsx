import { Alert, Heading, VStack } from '@navikt/ds-react';
import { Periode } from '~/types/Periode';
import { periodeTilFormatertDatotekst } from '~/utils/date';
import { UtbetalingStatus } from '~/components/utbetaling/status/UtbetalingStatus';
import { UtbetalingBeløp } from '~/components/utbetaling/beløp/UtbetalingBeløp';
import { SimulertBeregning } from '~/types/SimulertBeregningTypes';

import style from './BeregningOgSimuleringHeader.module.css';
import { Utbetalingsstatus } from '~/types/Utbetaling';
import { MeldekortBehandlingUtbetalingsstatus } from '~/types/meldekort/MeldekortBehandling';

type Props = {
    navkontor: string;
    navkontorNavn?: string;
    simulertBeregning: SimulertBeregning;
    utbetalingsstatus?: Utbetalingsstatus | MeldekortBehandlingUtbetalingsstatus;
    erOmberegning: boolean;
    className?: string;
};

export const BeregningOgSimuleringHeader = ({
    navkontor,
    navkontorNavn,
    simulertBeregning,
    utbetalingsstatus,
    erOmberegning,
    className,
}: Props) => {
    const { meldeperioder, beregning } = simulertBeregning;
    const { totalt } = beregning;

    const periode: Periode | undefined =
        meldeperioder.length > 0
            ? {
                  fraOgMed: meldeperioder.at(0)!.dager.at(0)!.dato,
                  tilOgMed: meldeperioder.at(-1)!.dager.at(-1)!.dato,
              }
            : undefined;

    const totalDiff = totalt.nå - (totalt.før ?? 0);

    const erFeilutbetaling = totalDiff < 0;

    const beløpTekst = erOmberegning
        ? `Beløp til ${erFeilutbetaling ? 'feilutbetaling' : 'etterbetaling'}`
        : 'Beløp';

    return (
        <VStack gap={'1'} className={className}>
            <Heading size={'small'} level={'3'} className={style.header}>
                {'Utbetaling'}
            </Heading>

            {erOmberegning && periode && (
                <Alert
                    variant={'info'}
                    inline={true}
                    size={'small'}
                >{`Vedtaket endrer beregningen av ${meldeperioder.length} meldeperiode i perioden ${periodeTilFormatertDatotekst(periode)}`}</Alert>
            )}

            <UtbetalingBeløp
                tekst={beløpTekst}
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
