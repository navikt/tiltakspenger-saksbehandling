import { periodiserBarnetilleggFraSøknad } from '~/components/behandling/felles/barnetillegg/utils/periodiserBarnetilleggFraSøknad';
import {
    hentTiltaksperiodeFraSøknad,
    rammebehandlingMedInnvilgelseEllerNull,
} from '~/utils/behandling';
import { hentBarnetilleggPerioderMedBarn } from '~/components/behandling/felles/barnetillegg/utils/hentBarnetilleggFraVedtakTidslinje';
import { SakProps } from '~/types/Sak';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { kunPerioderMedBarn } from '~/components/behandling/felles/barnetillegg/utils/barnetilleggUtils';
import { Periode, PeriodeMedNullable } from '~/types/Periode';
import { Søknadsbehandling } from '~/types/Søknadsbehandling';
import { Revurdering } from '~/types/Revurdering';
import { Rammebehandling } from '~/types/Rammebehandling';

export interface BarnetilleggPeriodeFormData {
    antallBarn: number;
    periode: PeriodeMedNullable;
}

export const hentBarnetilleggForSøknadsbehandling = (
    behandling: Søknadsbehandling,
): BarnetilleggPeriodeFormData[] => {
    return (
        hentLagredePerioderMedBarn(behandling) ||
        periodiserBarnetilleggFraSøknad(
            behandling.søknad.barnetillegg,
            behandling.virkningsperiode ?? hentTiltaksperiodeFraSøknad(behandling),
        )
    );
};

export const hentBarnetilleggForRevurdering = (
    periode: Periode,
    behandling: Revurdering,
    sak: SakProps,
): BarnetilleggPeriode[] => {
    return (
        hentLagredePerioderMedBarn(behandling) ||
        hentBarnetilleggPerioderMedBarn(
            sak.tidslinje.elementer.map((e) => e.rammevedtak),
            periode,
        )
    );
};

export const hentLagredePerioderMedBarn = (
    behandling: Rammebehandling,
): BarnetilleggPeriode[] | undefined => {
    return rammebehandlingMedInnvilgelseEllerNull(behandling)?.barnetillegg?.perioder.filter(
        kunPerioderMedBarn,
    );
};
