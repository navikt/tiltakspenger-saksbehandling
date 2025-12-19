import { Innvilgelsesperiode } from '~/types/Innvilgelsesperiode';
import { Alert } from '@navikt/ds-react';
import { removeDuplicates } from '~/utils/array';

type Props = {
    innvilgelsesperioder: Innvilgelsesperiode[];
};

export const InnvilgelsesperioderAntallDagerVarsel = ({ innvilgelsesperioder }: Props) => {
    const antallDagerPerMeldeperiode = innvilgelsesperioder
        .map((it) => it.antallDagerPerMeldeperiode)
        .filter(removeDuplicates);

    const antallDagerSettesAutomatiskIBrev =
        antallDagerPerMeldeperiode.length === 1 &&
        antallDagerPerMeldeperiode[0] <= 10 &&
        erPartall(antallDagerPerMeldeperiode[0]);

    if (antallDagerSettesAutomatiskIBrev) {
        return null;
    }

    return (
        <Alert variant={'info'}>
            {'Husk å oppgi antall dager per uke det innvilges tiltakspenger for i vedtaksbrevet.'}
        </Alert>
    );
};

const erPartall = (tall: number) => tall % 2 === 0;
