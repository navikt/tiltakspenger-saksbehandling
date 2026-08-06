import { VStack } from '@navikt/ds-react';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { Simuleringsflagg } from '~/lib/beregning-og-simulering/typer/SimulertBeregning';

type Props = {
    flagg: Simuleringsflagg[];
};

/**
 * Varsler utledet av simuleringsflaggene, for en eller flere meldeperioder.
 *
 * Backend sender fakta om hva simuleringen sier; her bestemmer vi hvor høyt det skal rope.
 * En justering som går opp i null er usynlig i beløpene — summen er null — så flagget er eneste måte å få øye på den.
 */
export const SimuleringsflaggVarsler = ({ flagg }: Props) => {
    const harUbalansertJustering = flagg.some((f) => f.justeringPåTversAvMeldeperiodeEllerMåned);
    const harBalansertJustering = flagg.some((f) => f.justeringGårOppINull);

    if (!harUbalansertJustering && !harBalansertJustering) {
        return null;
    }

    return (
        <VStack gap={'space-8'}>
            {harUbalansertJustering && (
                <Infokort variant={'advarsel'} size={'small'}>
                    {
                        'Simuleringen har en justering som ikke går opp innenfor meldeperioden — beløp er motregnet mot andre meldeperioder eller måneder. Kontroller at utbetalingen blir riktig.'
                    }
                </Infokort>
            )}
            {harBalansertJustering && (
                <Infokort variant={'info'} size={'small'}>
                    {
                        'Simuleringen har en justering som går opp innenfor meldeperioden og kalendermåneden. Oppdragssystemet beregner per kalendermåned og har bare omfordelt beløp mellom dager. Dagene er merket med posteringene som treffer dem.'
                    }
                </Infokort>
            )}
        </VStack>
    );
};
