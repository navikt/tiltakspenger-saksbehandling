import { Rammevedtak } from '~/types/VedtakTyper';

type AntallBarnFraVedtak = {
    minBarn: number;
    maxBarn: number;
};

export const tellAntallBarnFraVedtak = (vedtak: Rammevedtak): AntallBarnFraVedtak | null => {
    if (!vedtak.barnetillegg) {
        return null;
    }

    const antallBarnFraAllePerioder = vedtak.barnetillegg.perioder.map((bt) => bt.antallBarn);

    return {
        minBarn: Math.min(...antallBarnFraAllePerioder),
        maxBarn: Math.max(...antallBarnFraAllePerioder),
    };
};
