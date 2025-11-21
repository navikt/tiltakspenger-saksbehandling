import { Rammevedtak } from '~/types/Rammevedtak';
import { Periode } from '~/types/Periode';
import { joinPerioder, perioderOverlapper } from '~/utils/periode';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { datoMax, datoMin, nesteDag } from '~/utils/date';
import { kunPerioderMedBarn } from '~/components/behandling/felles/barnetillegg/utils/barnetilleggUtils';
import { BehandlingId } from '~/types/Rammebehandling';
import { Tidslinje } from '~/types/Tidslinje';

type VedtakMedBarnetillegg = Rammevedtak & {
    barnetillegg: NonNullable<Rammevedtak['barnetillegg']>;
};

type BarnetilleggMedBehandlingId = BarnetilleggPeriode & { behandlingId: BehandlingId };

export const hentBarnetilleggFraVedtakTidslinje = (
    tidslinje: Tidslinje,
    periode: Periode,
): BarnetilleggMedBehandlingId[] => {
    const relevanteBarnetillegg: BarnetilleggMedBehandlingId[] = tidslinje.elementer
        .map((el) => el.rammevedtak)
        .filter((vedtak): vedtak is VedtakMedBarnetillegg => !!vedtak.barnetillegg)
        .flatMap((vedtak) =>
            vedtak.barnetillegg.perioder
                .filter((bt) => perioderOverlapper(bt.periode, periode))
                .map((bt) => ({
                    ...bt,
                    behandlingId: vedtak.behandlingId,
                    periode: {
                        fraOgMed: datoMax(bt.periode.fraOgMed, periode.fraOgMed),
                        tilOgMed: datoMin(bt.periode.tilOgMed, periode.tilOgMed),
                    },
                })),
        );

    return relevanteBarnetillegg.reduce<BarnetilleggMedBehandlingId[]>((acc, neste) => {
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

export const hentBarnetilleggPerioderMedBarn = (
    tidslinje: Tidslinje,
    periode: Periode,
): BarnetilleggMedBehandlingId[] => {
    return hentBarnetilleggFraVedtakTidslinje(tidslinje, periode).filter(kunPerioderMedBarn);
};
