import { Rammevedtak } from '~/types/VedtakTyper';
import { Periode } from '~/types/Periode';
import { joinPerioder, perioderOverlapper } from '~/utils/periode';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { datoMax, datoMin, nesteDag } from '~/utils/date';
import { BehandlingId } from '~/types/BehandlingTypes';
import { kunPerioderMedBarn } from '~/components/behandling/felles/barnetillegg/utils/barnetilleggUtils';

type VedtakMedBarnetillegg = Rammevedtak & {
    barnetillegg: NonNullable<Rammevedtak['barnetillegg']>;
};

type BarnetilleggMedBehandlingId = BarnetilleggPeriode & { behandlingId: BehandlingId };

export const hentBarnetilleggFraVedtakTidslinje = (
    tidslinje: Rammevedtak[],
    behandlingsperiode: Periode,
): BarnetilleggMedBehandlingId[] => {
    const relevanteBarnetillegg: BarnetilleggMedBehandlingId[] = tidslinje
        .filter((vedtak): vedtak is VedtakMedBarnetillegg => !!vedtak.barnetillegg)
        .flatMap((vedtak) =>
            vedtak.barnetillegg.perioder
                .filter((bt) => perioderOverlapper(bt.periode, behandlingsperiode))
                .map((bt) => ({
                    ...bt,
                    behandlingId: vedtak.behandlingId,
                    periode: {
                        fraOgMed: datoMax(bt.periode.fraOgMed, behandlingsperiode.fraOgMed),
                        tilOgMed: datoMin(bt.periode.tilOgMed, behandlingsperiode.tilOgMed),
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
    tidslinje: Rammevedtak[],
    behandlingsperiode: Periode,
): BarnetilleggMedBehandlingId[] => {
    return hentBarnetilleggFraVedtakTidslinje(tidslinje, behandlingsperiode).filter(
        kunPerioderMedBarn,
    );
};
