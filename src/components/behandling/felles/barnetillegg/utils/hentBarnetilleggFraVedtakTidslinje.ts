import { Rammevedtak } from '~/types/Rammevedtak';
import { krympPeriodisering, utvidPeriodisering } from '~/utils/periode';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import {
    kunPerioderMedBarn,
    slåSammenBarnetillegg,
} from '~/components/behandling/felles/barnetillegg/utils/barnetilleggUtils';
import { BehandlingId } from '~/types/Rammebehandling';
import { TidslinjeRammevedtak } from '~/types/TidslinjeRammevedtak';
import { Periode } from '~/types/Periode';

type VedtakMedBarnetillegg = Rammevedtak & {
    barnetillegg: NonNullable<Rammevedtak['barnetillegg']>;
};

type BarnetilleggMedBehandlingId = BarnetilleggPeriode & { behandlingId: BehandlingId };

const hentBarnetilleggFraVedtak = (
    tidslinje: TidslinjeRammevedtak,
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

    return slåSammenBarnetillegg(relevanteBarnetillegg);
};

export const hentBarnetilleggFraVedtakKunMedBarn = (
    tidslinje: TidslinjeRammevedtak,
): BarnetilleggMedBehandlingId[] => {
    return hentBarnetilleggFraVedtak(tidslinje).filter(kunPerioderMedBarn);
};

export const barnetilleggKrympetTilPeriode = (
    tidslinje: TidslinjeRammevedtak,
    periode: Periode,
    kunMedBarn: boolean,
): BarnetilleggMedBehandlingId[] => {
    return krympPeriodisering(
        kunMedBarn
            ? hentBarnetilleggFraVedtakKunMedBarn(tidslinje)
            : hentBarnetilleggFraVedtak(tidslinje),
        periode,
    );
};

export const barnetilleggUtvidetTilPeriode = (
    tidslinje: TidslinjeRammevedtak,
    periode: Periode,
    kunMedBarn: boolean,
): BarnetilleggMedBehandlingId[] => {
    return utvidPeriodisering(
        kunMedBarn
            ? hentBarnetilleggFraVedtakKunMedBarn(tidslinje)
            : hentBarnetilleggFraVedtak(tidslinje),
        periode,
    );
};
