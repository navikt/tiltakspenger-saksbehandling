import { Alert, BodyShort, VStack } from '@navikt/ds-react';
import { MeldekortUker } from '~/lib/meldekort/0-felles-komponenter/uker/MeldekortUker';
import {
    BeregningKildeType,
    MeldeperiodeBeregningProps,
} from '~/lib/beregning-og-simulering/typer/Beregning';
import { beregningKildeUrl } from '~/utils/urls';
import { useSak } from '~/lib/sak/SakContext';
import { MeldekortBeløp } from '~/lib/meldekort/0-felles-komponenter/beløp/MeldekortBeløp';
import { useFeatureToggles } from '~/context/FeatureTogglesContext';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';

type Props = {
    beregning: MeldeperiodeBeregningProps | null;
    className?: string;
};

export const MeldeperiodekjedeGjeldendeBeregning = ({ beregning, className }: Props) => {
    return (
        <VStack gap={'space-16'} className={className}>
            {beregning ? (
                <GjeldendeBeregning {...beregning} />
            ) : (
                <Alert variant={'info'}>
                    {'Det finnes ingen beregninger for denne meldeperioden ennå'}
                </Alert>
            )}
        </VStack>
    );
};

const GjeldendeBeregning = ({ dager, beregningKilde, beløp }: MeldeperiodeBeregningProps) => {
    const { sak } = useSak();
    const { meldekortbehandlingV2Toggle } = useFeatureToggles();

    return (
        <>
            <BodyShort>
                {'Kilde for beregningen: '}
                <InternLenke
                    href={beregningKildeUrl(beregningKilde, sak, meldekortbehandlingV2Toggle)}
                >
                    {beregningKilde.type === BeregningKildeType.MELDEKORT
                        ? 'Meldekortbehandling'
                        : 'Rammebehandling'}
                </InternLenke>
            </BodyShort>

            <MeldekortUker dager={dager} />

            <MeldekortBeløp beløp={beløp} />
        </>
    );
};
