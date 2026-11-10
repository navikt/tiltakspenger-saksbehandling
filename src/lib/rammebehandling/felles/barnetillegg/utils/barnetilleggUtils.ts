import { BarnetilleggPeriode } from '~/lib/rammebehandling/typer/Barnetillegg';
import { SakProps } from '~/lib/sak/SakTyper';
import { barnetilleggKrympetTilPeriode } from '~/lib/rammebehandling/felles/barnetillegg/utils/hentBarnetilleggFraVedtakTidslinje';
import { Periode } from '~/types/Periode';
import { Rammebehandling, Rammebehandlingstype } from '~/lib/rammebehandling/typer/Rammebehandling';
import { erDatoIPeriode, slåSammenPeriodisering } from '~/utils/periode';
import { forrigeDag, nesteDag } from '~/utils/date';
import { removeDuplicatesFilter } from '~/utils/array';

export const kunPerioderMedBarn = (it: BarnetilleggPeriode) => it.antallBarn > 0;

export const harSøktBarnetillegg = (periode: Periode, behandling: Rammebehandling, sak: SakProps) =>
    (behandling.type === Rammebehandlingstype.SØKNADSBEHANDLING
        ? behandling.søknad.barnetillegg
        : barnetilleggKrympetTilPeriode(sak, periode, true)
    ).length > 0;

export const slåSammenBarnetillegg = <T extends BarnetilleggPeriode>(periodisering: T[]): T[] => {
    return slåSammenPeriodisering(periodisering, (a, b) => a.antallBarn === b.antallBarn);
};

/** Barnetillegget for hele innvilgelsesperiodene, der dagene uten barnetillegg får 0 barn. */
export const barnetilleggForInnvilgelsesperiodene = (
    barnetillegg: BarnetilleggPeriode[],
    innvilgelsesperioder: Periode[],
): BarnetilleggPeriode[] => {
    const avgrensningsdatoer = [...innvilgelsesperioder, ...barnetillegg.map((it) => it.periode)]
        .flatMap((periode) => [periode.fraOgMed, nesteDag(periode.tilOgMed)])
        .filter(removeDuplicatesFilter())
        .toSorted();

    const periodisert = avgrensningsdatoer
        .slice(0, -1)
        .map((fraOgMed, index) => ({
            antallBarn:
                barnetillegg.find((it) => erDatoIPeriode(fraOgMed, it.periode))?.antallBarn ?? 0,
            periode: {
                fraOgMed,
                tilOgMed: forrigeDag(avgrensningsdatoer.atNonNull(index + 1)),
            },
        }))
        .filter((it) =>
            innvilgelsesperioder.some((periode) => erDatoIPeriode(it.periode.fraOgMed, periode)),
        );

    return slåSammenBarnetillegg(periodisert);
};
