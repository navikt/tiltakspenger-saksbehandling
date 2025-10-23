import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { SakProps } from '~/types/Sak';
import { hentBarnetilleggPerioderMedBarn } from '~/components/behandling/felles/barnetillegg/utils/hentBarnetilleggFraVedtakTidslinje';
import { Periode } from '~/types/Periode';
import { Rammevedtak } from '~/types/Vedtak';
import { Rammebehandling, Behandlingstype } from '~/types/Behandling';

export const kunPerioderMedBarn = (it: BarnetilleggPeriode) => it.antallBarn > 0;

export const harSøktBarnetillegg = (periode: Periode, behandling: Rammebehandling, sak: SakProps) =>
    (behandling.type === Behandlingstype.SØKNADSBEHANDLING
        ? behandling.søknad.barnetillegg
        : hentBarnetilleggPerioderMedBarn(sak.tidslinje, periode)
    ).length > 0;

type AntallBarnFraVedtak = {
    minBarn: number;
    maxBarn: number;
};

export const tellAntallBarnFraVedtak = (vedtak: Rammevedtak): AntallBarnFraVedtak => {
    if (!vedtak.barnetillegg) {
        return {
            minBarn: 0,
            maxBarn: 0,
        };
    }

    const antallBarnFraAllePerioder = vedtak.barnetillegg.perioder.map((bt) => bt.antallBarn);

    return {
        minBarn: Math.min(...antallBarnFraAllePerioder),
        maxBarn: Math.max(...antallBarnFraAllePerioder),
    };
};
