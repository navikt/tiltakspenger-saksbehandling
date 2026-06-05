import { Heading, VStack } from '@navikt/ds-react';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { InfokortEnkel } from '~/lib/_felles/infokort/InfokortEnkel';
import React from 'react';
import { UtbetalingBeløp } from '~/lib/_felles/utbetaling/beløp/UtbetalingBeløp';

type Props = {
    kjedeId: MeldeperiodeKjedeId;
};

export const MeldeperiodebehandlingBeregning = ({ kjedeId }: Props) => {
    const { simulertBeregning } = useMeldekortbehandling();

    const beregning = simulertBeregning?.meldeperioder.find(
        (it) => it.kjedeId == kjedeId,
    )?.beregning;

    if (!beregning) {
        return (
            <InfokortEnkel header={'Beregning mangler'} variant={'advarsel'}>
                {'Lagre behandlingen for å beregne'}
            </InfokortEnkel>
        );
    }

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
