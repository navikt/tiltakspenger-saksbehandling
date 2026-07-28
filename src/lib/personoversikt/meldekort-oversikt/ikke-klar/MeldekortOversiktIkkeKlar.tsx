import { InlineMessage } from '@navikt/ds-react';
import { MeldeperiodekjedeProps } from '~/lib/meldekort/typer/Meldeperiode';
import { formaterPeriode } from '~/utils/date';
import { periodiseringTotalPeriode } from '~/utils/periode';

type Props = {
    meldeperiodekjeder: MeldeperiodekjedeProps[];
};

export const MeldekortOversiktIkkeKlar = ({ meldeperiodekjeder }: Props) => {
    const ikkeKlar = meldeperiodekjeder.filter((kjede) => !kjede.kanBehandles);

    if (ikkeKlar.length === 0) {
        return null;
    }

    const { fraOgMed, tilOgMed } = periodiseringTotalPeriode(ikkeKlar);

    return (
        <InlineMessage status={'info'} size={'small'}>
            {`${ikkeKlar.length} meldeperioder ikke klare til behandling i perioden ${formaterPeriode({ fraOgMed, tilOgMed })}`}
        </InlineMessage>
    );
};
