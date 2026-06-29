import { Heading, VStack } from '@navikt/ds-react';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { UtbetalingBeløp } from '~/lib/_felles/utbetaling/beløp/UtbetalingBeløp';

type Props = {
    kjedeId: MeldeperiodeKjedeId;
};

export const MeldeperiodebehandlingBeregning = ({ kjedeId }: Props) => {
    const { simulertBeregning } = useMeldekortbehandling();

    const simuleringOgBeregning = simulertBeregning?.meldeperioder.find(
        (it) => it.kjedeId == kjedeId,
    );

    if (!simuleringOgBeregning) {
        return (
            <Infokort header={'Beregning mangler'} variant={'advarsel'}>
                {'Lagre behandlingen for å beregne og simulere meldeperioden'}
            </Infokort>
        );
    }

    const { beregning } = simuleringOgBeregning;

    return (
        <VStack gap={'space-8'}>
            <Heading size={'xsmall'} level={'4'}>
                {'Beregnede beløp for meldeperioden'}
            </Heading>
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
