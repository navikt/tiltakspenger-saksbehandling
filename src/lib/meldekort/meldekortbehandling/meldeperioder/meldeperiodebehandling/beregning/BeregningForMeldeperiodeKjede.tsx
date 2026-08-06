import { Heading, VStack } from '@navikt/ds-react';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { UtbetalingBeløp } from '~/lib/_felles/utbetaling/beløp/UtbetalingBeløp';
import { SimulertBeregning } from '~/lib/beregning-og-simulering/typer/SimulertBeregning';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiodekjede';

type Props = {
    kjedeId: MeldeperiodeKjedeId;
    simulertBeregning: SimulertBeregning;
    headerTekst?: string;
    className?: string;
};

export const BeregningForMeldeperiodeKjede = ({
    kjedeId,
    simulertBeregning,
    headerTekst,
    className,
}: Props) => {
    const simuleringOgBeregning = simulertBeregning.meldeperioder.find(
        (it) => it.kjedeId == kjedeId,
    );

    if (!simuleringOgBeregning) {
        return (
            <Infokort header={'Beregning mangler'} variant={'advarsel'}>
                {'Beregning mangler for meldeperioden'}
            </Infokort>
        );
    }

    const { beregning } = simuleringOgBeregning;

    return (
        <VStack gap={'space-8'} className={className}>
            {headerTekst && (
                <Heading size={'xsmall'} level={'4'}>
                    {headerTekst}
                </Heading>
            )}
            <VStack gap={'space-4'}>
                <UtbetalingBeløp
                    tekst={'Totalt beløp'}
                    beløp={beregning.totalt.nå}
                    beløpForrige={beregning.totalt.før}
                />
                <UtbetalingBeløp
                    tekst={'Tiltakspenger beløp'}
                    beløp={beregning.ordinært.nå}
                    beløpForrige={beregning.ordinært.før}
                />
                <UtbetalingBeløp
                    tekst={'Barnetillegg beløp'}
                    beløp={beregning.barnetillegg.nå}
                    beløpForrige={beregning.barnetillegg.før}
                />
            </VStack>
        </VStack>
    );
};
