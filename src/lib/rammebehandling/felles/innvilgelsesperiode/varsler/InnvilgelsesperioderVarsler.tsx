import { Innvilgelsesperioder } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { removeDuplicatesFilter } from '~/utils/array';

type Props = {
    innvilgelsesperioder: Innvilgelsesperioder;
};

export const InnvilgelsesperioderVarsler = ({ innvilgelsesperioder }: Props) => {
    const antallDagerPerMeldeperiode = innvilgelsesperioder.antallDagerPerMeldeperiode
        .map((it) => it.antallDagerPerMeldeperiode)
        .filter(removeDuplicatesFilter());

    const antallDagerSettesIkkeAutomatiskIBrev =
        antallDagerPerMeldeperiode.length > 1 ||
        antallDagerPerMeldeperiode[0] > 10 ||
        erOddetall(antallDagerPerMeldeperiode[0]);

    if (!antallDagerSettesIkkeAutomatiskIBrev) {
        return null;
    }

    return (
        <Infokort variant={'info'} size={'small'}>
            {'Husk å oppgi antall dager per uke det innvilges tiltakspenger for i vedtaksbrevet.'}
        </Infokort>
    );
};

const erOddetall = (tall: number) => tall % 2 === 1;
