import { Alert } from '@navikt/ds-react';
import { MeldeperiodeKjedeProps } from '../../../../types/meldekort/Meldeperiode';
import { periodeTilFormatertDatotekst } from '../../../../utils/date';

type Props = {
    meldeperiodeKjeder: MeldeperiodeKjedeProps[];
};

export const MeldekortOversiktIkkeKlar = ({ meldeperiodeKjeder }: Props) => {
    if (meldeperiodeKjeder.length === 0) {
        return null;
    }

    const fraOgMed = meldeperiodeKjeder.at(0)!.periode.fraOgMed;
    const tilOgMed = meldeperiodeKjeder.at(-1)!.periode.tilOgMed;

    const periodeTekst = periodeTilFormatertDatotekst({ fraOgMed, tilOgMed });

    return (
        <Alert
            inline={true}
            variant={'info'}
            size={'small'}
        >{`${meldeperiodeKjeder.length} meldekort ikke klare til behandling i perioden ${periodeTekst}`}</Alert>
    );
};
