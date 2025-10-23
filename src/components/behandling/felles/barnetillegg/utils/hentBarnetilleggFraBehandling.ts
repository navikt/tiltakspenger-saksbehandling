import { periodiserBarnetilleggFraSøknad } from '~/components/behandling/felles/barnetillegg/utils/periodiserBarnetilleggFraSøknad';
import { hentTiltaksperiodeFraSøknad } from '~/utils/behandling';
import { hentBarnetilleggPerioderMedBarn } from '~/components/behandling/felles/barnetillegg/utils/hentBarnetilleggFraVedtakTidslinje';
import { SakProps } from '~/types/Sak';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { kunPerioderMedBarn } from '~/components/behandling/felles/barnetillegg/utils/barnetilleggUtils';
import { Periode, PeriodeMedNullable } from '~/types/Periode';
import { Nullable } from '~/types/UtilTypes';

import { Søknadsbehandling } from '~/types/Søknadsbehandling';
import { Revurdering } from '~/types/Revurdering';
import { Rammebehandling } from '~/types/Behandling';

export interface BarnetilleggFormData {
    perioder: BarnetilleggPeriodeFormData[];
    begrunnelse: Nullable<string>;
}

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
        hentBarnetilleggPerioderMedBarn(sak.tidslinje, periode)
    );
};

export const hentLagredePerioderMedBarn = (
    behandling: Rammebehandling,
): BarnetilleggPeriode[] | undefined => {
    return behandling.barnetillegg?.perioder.filter(kunPerioderMedBarn);
};
