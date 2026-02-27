import { Alert, Heading, VStack } from '@navikt/ds-react';
import { Periode } from '~/types/Periode';
import { periodeTilFormatertDatotekst } from '~/utils/date';
import { UtbetalingStatus } from '~/components/utbetaling/status/UtbetalingStatus';
import { UtbetalingBeløp } from '~/components/utbetaling/beløp/UtbetalingBeløp';
import { SimulertBeregning } from '~/types/SimulertBeregning';
import { KanIkkeIverksetteUtbetalingGrunn, Utbetalingsstatus } from '~/types/Utbetaling';
import { Nullable } from '~/types/UtilTypes';

import style from './BeregningOgSimuleringHeader.module.css';

type Props = {
    navkontor: string;
    navkontorNavn?: string;
    simulertBeregning: SimulertBeregning;
    utbetalingsstatus?: Utbetalingsstatus;
    kanIkkeIverksetteUtbetaling: Nullable<KanIkkeIverksetteUtbetalingGrunn>;
    erOmberegning: boolean;
    className?: string;
};

export const BeregningOgSimuleringHeader = ({
    navkontor,
    navkontorNavn,
    simulertBeregning,
    utbetalingsstatus,
    kanIkkeIverksetteUtbetaling,
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

    return (
        <VStack gap={'space-4'} className={className}>
            <Heading size={'small'} level={'3'} className={style.header}>
                {'Beregnet utbetaling'}
            </Heading>
            {erOmberegning && periode && (
                <Alert
                    variant={'info'}
                    inline={true}
                    size={'small'}
                >{`Vedtaket påvirker beregningen av ${meldeperioder.length} meldeperiode${meldeperioder.length > 1 ? 'r' : ''} i perioden ${periodeTilFormatertDatotekst(periode)}`}</Alert>
            )}
            {kanIkkeIverksetteUtbetaling && (
                <Alert variant={'error'} size={'small'}>
                    {`Utbetalingen kan ikke iverksettes: ${utbetalingValideringsfeilTekst[kanIkkeIverksetteUtbetaling]}`}
                </Alert>
            )}
            <UtbetalingBeløp
                tekst={erOmberegning ? 'Beregnet endring i utbetalingen' : 'Beregnet beløp'}
                beløp={totalDiff}
                className={totalDiff < 0 ? style.tilbakekrevingBeløp : style.etterbetalingBeløp}
            />
            <UtbetalingStatus
                navkontor={navkontor}
                navkontorNavn={navkontorNavn}
                utbetalingsstatus={utbetalingsstatus}
            />
        </VStack>
    );
};

const utbetalingValideringsfeilTekst: Record<KanIkkeIverksetteUtbetalingGrunn, string> = {
    [KanIkkeIverksetteUtbetalingGrunn.FeilutbetalingStøttesIkke]:
        'Negativt endret beløp kan føre til feilutbetaling, som vi ikke støtter ennå',
    [KanIkkeIverksetteUtbetalingGrunn.JusteringStøttesIkke]:
        'Justeringer på tvers av meldeperioder eller kalendermåneder støttes ikke ennå',
    [KanIkkeIverksetteUtbetalingGrunn.SimuleringMangler]: 'Simulering mangler',
    [KanIkkeIverksetteUtbetalingGrunn.SimuleringHarEndringer]: 'Kontroll-simulering har endringer',
};
