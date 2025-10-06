import { Alert, Heading, VStack } from '@navikt/ds-react';
import { BehandlingStatus, BehandlingUtbetalingProps } from '~/types/BehandlingTypes';
import { Periode } from '~/types/Periode';
import { periodeTilFormatertDatotekst } from '~/utils/date';
import { UtbetalingStatus } from '~/components/utbetaling/status/UtbetalingStatus';
import { UtbetalingBeløp } from '~/components/utbetaling/beløp/UtbetalingBeløp';

import style from './BehandlingBeregningHeader.module.css';

type Props = {
    utbetaling: BehandlingUtbetalingProps;
    behandlingStatus: BehandlingStatus;
    className?: string;
};

export const BehandlingBeregningHeader = ({ utbetaling, behandlingStatus, className }: Props) => {
    const { navkontor, navkontorNavn, status: utbetalingStatus, simulertBeregning } = utbetaling;
    const { meldeperioder, beregning } = simulertBeregning;
    const { totalt } = beregning;

    const periode: Periode = {
        fraOgMed: meldeperioder.at(0)!.dager.at(0)!.dato,
        tilOgMed: meldeperioder.at(-1)!.dager.at(-1)!.dato,
    };

    const totalDiff = totalt.nå - (totalt.før ?? 0);

    const erEtterbetaling = totalDiff > 0;

    return (
        <VStack gap={'1'} className={className}>
            <Heading size={'small'} level={'3'}>
                {'Utbetaling'}
            </Heading>

            <Alert
                variant={'info'}
                inline={true}
                size={'small'}
            >{`Vedtaket endrer beregningen av ${meldeperioder.length} meldekort i perioden ${periodeTilFormatertDatotekst(periode)}`}</Alert>

            <UtbetalingBeløp
                tekst={`Beløp til ${erEtterbetaling ? 'etterbetaling' : 'feilutbetaling'}`}
                beløp={Math.abs(totalDiff)}
                className={erEtterbetaling ? style.etterbetalingBeløp : style.tilbakekrevingBeløp}
            />

            <UtbetalingStatus
                navkontor={navkontor}
                navkontorNavn={navkontorNavn}
                utbetalingsstatus={
                    behandlingStatus === BehandlingStatus.VEDTATT ? utbetalingStatus : undefined
                }
            />
        </VStack>
    );
};
