import { periodiserBarnetilleggFraSøknad } from '~/components/behandling/felles/barnetillegg/utils/periodiserBarnetilleggFraSøknad';
import { rammebehandlingMedInnvilgelseEllerNull } from '~/utils/behandling';
import { barnetilleggUtvidetTilPeriode } from '~/components/behandling/felles/barnetillegg/utils/hentBarnetilleggFraVedtakTidslinje';
import { SakProps } from '~/types/Sak';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { kunPerioderMedBarn } from '~/components/behandling/felles/barnetillegg/utils/barnetilleggUtils';
import { Periode } from '~/types/Periode';
import { Søknadsbehandling } from '~/types/Søknadsbehandling';
import { Revurdering } from '~/types/Revurdering';
import { Rammebehandling, Rammebehandlingstype } from '~/types/Rammebehandling';
import { TidslinjeRammevedtak } from '~/types/TidslinjeRammevedtak';

export const hentBarnetilleggForSøknadsbehandling = (
    behandling: Søknadsbehandling,
    innvilgelseperiode: Periode,
): BarnetilleggPeriode[] => {
    return (
        hentLagredePerioderMedBarn(behandling) ||
        periodiserBarnetilleggFraSøknad(behandling.søknad.barnetillegg, innvilgelseperiode)
    );
};

export const hentBarnetilleggForRevurdering = (
    behandling: Revurdering,
    innvilgelsesperiode: Periode,
    sak: SakProps,
): BarnetilleggPeriode[] => {
    return (
        hentLagredePerioderMedBarn(behandling) ||
        hentBarnetilleggForhåndsutfyltForRevurdering(sak.tidslinje, innvilgelsesperiode)
    );
};

export const hentBarnetilleggForhåndsutfyltForRevurdering = (
    tidslinje: TidslinjeRammevedtak,
    innvilgelsesperiode: Periode,
) => {
    return barnetilleggUtvidetTilPeriode(tidslinje, innvilgelsesperiode, true);
};

export const hentBarnetilleggForBehandling = (
    behandling: Rammebehandling,
    innvilgelsesperiode: Periode,
    sak: SakProps,
): BarnetilleggPeriode[] => {
    return behandling.type === Rammebehandlingstype.SØKNADSBEHANDLING
        ? hentBarnetilleggForSøknadsbehandling(behandling, innvilgelsesperiode)
        : hentBarnetilleggForRevurdering(behandling, innvilgelsesperiode, sak);
};

export const hentLagredePerioderMedBarn = (
    behandling: Rammebehandling,
): BarnetilleggPeriode[] | undefined => {
    return rammebehandlingMedInnvilgelseEllerNull(behandling)?.barnetillegg?.perioder.filter(
        kunPerioderMedBarn,
    );
};
