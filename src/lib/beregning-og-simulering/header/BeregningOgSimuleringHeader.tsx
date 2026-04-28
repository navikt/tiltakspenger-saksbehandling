import { Alert, Heading, VStack } from '@navikt/ds-react';
import { Periode } from '~/types/Periode';
import { periodeTilFormatertDatotekst } from '~/utils/date';
import { UtbetalingStatus } from '~/lib/beregning-og-simulering/header/status/UtbetalingStatus';
import { UtbetalingBeløp } from '~/lib/_felles/utbetaling/beløp/UtbetalingBeløp';
import { SimulertBeregning } from '~/lib/beregning-og-simulering/typer/SimulertBeregning';
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
    const { meldeperioder, beregning, simulerteBeløp } = simulertBeregning;
    const { totalt } = beregning;

    const periode: Periode | undefined =
        meldeperioder.length > 0
            ? {
                  fraOgMed: meldeperioder.at(0)!.dager.at(0)!.dato,
                  tilOgMed: meldeperioder.at(-1)!.dager.at(-1)!.dato,
              }
            : undefined;

    const beregnetDiff = totalt.nå - (totalt.før ?? 0);

    const harNegativBeregningUtenFeilutbetaling =
        beregnetDiff < 0 && !simulerteBeløp?.feilutbetaling;

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
                <Alert variant={'error'}>
                    {`Utbetalingen kan ikke iverksettes: ${utbetalingValideringsfeilTekst[kanIkkeIverksetteUtbetaling]}`}
                </Alert>
            )}

            {harNegativBeregningUtenFeilutbetaling && (
                <Alert variant={'warning'}>
                    {
                        'Beregningen viser negativt endret beløp, men simulering viser ingen feilutbetaling.'
                    }
                    {' Dette betyr som regel at forrige utbetaling ikke har blitt kjørt ennå.'}
                    {
                        ' Dersom denne behandlingen iverksettes før forrige utbetaling kjøres, vil dette ikke føre til feilutbetaling.'
                    }
                </Alert>
            )}

            <UtbetalingBeløp
                tekst={erOmberegning ? 'Beregnet endring i utbetalingen' : 'Beregnet beløp'}
                beløp={beregnetDiff}
                className={beregnetDiff < 0 ? style.feilutbetalingBeløp : style.etterbetalingBeløp}
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
    [KanIkkeIverksetteUtbetalingGrunn.JusteringStøttesIkke]:
        'Justeringer på tvers av meldeperioder eller kalendermåneder støttes ikke ennå',
    [KanIkkeIverksetteUtbetalingGrunn.SimuleringMangler]: 'Simulering mangler',
    [KanIkkeIverksetteUtbetalingGrunn.SimuleringHarEndringer]: 'Kontroll-simulering har endringer',
    [KanIkkeIverksetteUtbetalingGrunn.BehandlingstypeStøtterIkkeFeilutbetaling]:
        'Behandlingstypen støtter ikke feilutbetaling',
    [KanIkkeIverksetteUtbetalingGrunn.BehandlingstypeStøtterIkkeJustering]:
        'Behandlingstypen støtter ikke justeringer',
};
