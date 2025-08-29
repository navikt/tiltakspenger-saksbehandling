import { Rammevedtak } from '~/types/VedtakTyper';
import { Periode } from '~/types/Periode';
import { perioderOverlapper } from '~/utils/periode';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { datoMax, datoMin } from '~/utils/date';

type VedtakMedBarnetillegg = Rammevedtak & {
    barnetillegg: NonNullable<Rammevedtak['barnetillegg']>;
};

export const hentBarnetilleggFraVedtakTidslinje = (
    tidslinje: Rammevedtak[],
    behandlingsperiode: Periode,
): BarnetilleggPeriode[] => {
    return tidslinje
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
};
