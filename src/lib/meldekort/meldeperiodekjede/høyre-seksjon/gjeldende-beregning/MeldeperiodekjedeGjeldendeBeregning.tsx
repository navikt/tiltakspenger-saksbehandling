import { BodyShort, VStack } from '@navikt/ds-react';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { MeldekortUker } from '~/lib/meldekort/felles/uker/MeldekortUker';
import {
    BeregningKildeType,
    MeldeperiodeBeregningProps,
} from '~/lib/beregning-og-simulering/typer/Beregning';
import { beregningKildeUrl } from '~/utils/urls';
import { useSak } from '~/lib/sak/SakContext';
import { MeldekortBeløp } from '~/lib/meldekort/felles/beløp/MeldekortBeløp';
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
                <Infokort variant={'info'}>
                    {'Det finnes ingen beregninger for denne meldeperioden ennå'}
                </Infokort>
            )}
        </VStack>
    );
};

const GjeldendeBeregning = ({ dager, beregningKilde, beløp }: MeldeperiodeBeregningProps) => {
    const { sak } = useSak();

    return (
        <>
            <BodyShort>
                {'Kilde for beregningen: '}
                <InternLenke href={beregningKildeUrl(beregningKilde, sak)}>
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
