import { Rammevedtak } from '~/types/VedtakTyper';
import { Periode } from '~/types/Periode';
import { joinPerioder, perioderOverlapper } from '~/utils/periode';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { datoMax, datoMin, nesteDag } from '~/utils/date';

type VedtakMedBarnetillegg = Rammevedtak & {
    barnetillegg: NonNullable<Rammevedtak['barnetillegg']>;
};

export const hentBarnetilleggFraVedtakTidslinje = (
    tidslinje: Rammevedtak[],
    behandlingsperiode: Periode,
): BarnetilleggPeriode[] => {
    const relevanteBarnetilleggsPerioder = tidslinje
        .filter(
            (vedtak): vedtak is VedtakMedBarnetillegg =>
                perioderOverlapper(vedtak.periode, behandlingsperiode) && !!vedtak.barnetillegg,
        )
        .flatMap((vedtak) =>
            vedtak.barnetillegg.perioder.map((bt) => ({
                ...bt,
                periode: {
                    fraOgMed: datoMax(bt.periode.fraOgMed, behandlingsperiode.fraOgMed),
                    tilOgMed: datoMin(bt.periode.tilOgMed, behandlingsperiode.tilOgMed),
                },
            })),
        );

    if (relevanteBarnetilleggsPerioder.length === 0) {
        return [];
    }

    return relevanteBarnetilleggsPerioder.reduce<BarnetilleggPeriode[]>((acc, neste) => {
        const forrige = acc.at(-1);
        if (!forrige) {
            return [neste];
        }

        const erSammenhengedePerioder =
            forrige.antallBarn == neste.antallBarn &&
            nesteDag(forrige.periode.tilOgMed) === neste.periode.fraOgMed;

        if (erSammenhengedePerioder) {
            return acc.with(-1, {
                ...forrige,
                periode: joinPerioder([forrige.periode, neste.periode]),
            });
        }

        return [...acc, neste];
    }, []);
};
