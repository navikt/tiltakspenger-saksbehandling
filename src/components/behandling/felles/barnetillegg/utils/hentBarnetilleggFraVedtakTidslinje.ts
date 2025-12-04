import { Rammevedtak } from '~/types/Rammevedtak';
import { joinPerioder, krympPeriodisering, utvidPeriodisering } from '~/utils/periode';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { nesteDag } from '~/utils/date';
import { kunPerioderMedBarn } from '~/components/behandling/felles/barnetillegg/utils/barnetilleggUtils';
import { BehandlingId } from '~/types/Rammebehandling';
import { Tidslinje } from '~/types/Tidslinje';
import { Periode } from '~/types/Periode';

type VedtakMedBarnetillegg = Rammevedtak & {
    barnetillegg: NonNullable<Rammevedtak['barnetillegg']>;
};

type BarnetilleggMedBehandlingId = BarnetilleggPeriode & { behandlingId: BehandlingId };

const hentBarnetilleggFraVedtakTidslinje = (
    tidslinje: Tidslinje,
): BarnetilleggMedBehandlingId[] => {
    const relevanteBarnetillegg: BarnetilleggMedBehandlingId[] = tidslinje.elementer
        .map((el) => el.rammevedtak)
        .filter((vedtak): vedtak is VedtakMedBarnetillegg => !!vedtak.barnetillegg)
        .flatMap((vedtak) =>
            vedtak.barnetillegg.perioder.map((bt) => ({
                ...bt,
                behandlingId: vedtak.behandlingId,
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
): BarnetilleggMedBehandlingId[] => {
    return hentBarnetilleggFraVedtakTidslinje(tidslinje).filter(kunPerioderMedBarn);
};

export const barnetilleggKrympetTilPeriode = (
    tidslinje: Tidslinje,
    periode: Periode,
    kunMedBarn: boolean,
): BarnetilleggMedBehandlingId[] => {
    return krympPeriodisering(
        kunMedBarn
            ? hentBarnetilleggPerioderMedBarn(tidslinje)
            : hentBarnetilleggFraVedtakTidslinje(tidslinje),
        periode,
    );
};

export const barnetilleggUtvidetTilPeriode = (
    tidslinje: Tidslinje,
    periode: Periode,
    kunMedBarn: boolean,
): BarnetilleggMedBehandlingId[] => {
    return utvidPeriodisering(
        kunMedBarn
            ? hentBarnetilleggPerioderMedBarn(tidslinje)
            : hentBarnetilleggFraVedtakTidslinje(tidslinje),
        periode,
    );
};
