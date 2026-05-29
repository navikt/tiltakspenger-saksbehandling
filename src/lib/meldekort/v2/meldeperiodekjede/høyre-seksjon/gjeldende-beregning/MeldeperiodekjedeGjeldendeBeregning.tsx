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

import style from './MeldeperiodekjedeGjeldendeBeregning.module.css';

type Props = {
    beregning: MeldeperiodeBeregningProps | null;
};

export const MeldeperiodekjedeGjeldendeBeregning = ({ beregning }: Props) => {
    return beregning ? (
        <GjeldendeBeregning {...beregning} />
    ) : (
        <Alert variant={'info'}>
            {'Det finnes ingen beregninger for denne meldeperioden ennå'}
        </Alert>
    );
};

const GjeldendeBeregning = ({ dager, beregningKilde, beløp }: MeldeperiodeBeregningProps) => {
    const { sak } = useSak();
    const { meldekortbehandlingV2Toggle } = useFeatureToggles();

    return (
        <VStack gap={'space-16'} className={style.beregning}>
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
        </VStack>
    );
};
