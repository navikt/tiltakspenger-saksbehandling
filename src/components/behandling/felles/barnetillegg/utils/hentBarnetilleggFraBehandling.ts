import { periodiserBarnetilleggFraSøknad } from '~/components/behandling/felles/barnetillegg/utils/periodiserBarnetilleggFraSøknad';
import { rammebehandlingMedInnvilgelseEllerNull } from '~/utils/behandling';
import { hentBarnetilleggPerioderMedBarn } from '~/components/behandling/felles/barnetillegg/utils/hentBarnetilleggFraVedtakTidslinje';
import { SakProps } from '~/types/Sak';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { kunPerioderMedBarn } from '~/components/behandling/felles/barnetillegg/utils/barnetilleggUtils';
import { Periode } from '~/types/Periode';
import { Søknadsbehandling } from '~/types/Søknadsbehandling';
import { Revurdering } from '~/types/Revurdering';
import { Rammebehandling, Rammebehandlingstype } from '~/types/Rammebehandling';

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
    periode: Periode,
    sak: SakProps,
): BarnetilleggPeriode[] => {
    return (
        hentLagredePerioderMedBarn(behandling) ||
        hentBarnetilleggPerioderMedBarn(sak.tidslinje, periode)
    );
};

export const hentBarnetilleggForBehandling = (
    behandling: Rammebehandling,
    periode: Periode,
    sak: SakProps,
): BarnetilleggPeriode[] => {
    return behandling.type === Rammebehandlingstype.SØKNADSBEHANDLING
        ? hentBarnetilleggForSøknadsbehandling(behandling, periode)
        : hentBarnetilleggForRevurdering(behandling, periode, sak);
};

export const hentLagredePerioderMedBarn = (
    behandling: Rammebehandling,
): BarnetilleggPeriode[] | undefined => {
    return rammebehandlingMedInnvilgelseEllerNull(behandling)?.barnetillegg?.perioder.filter(
        kunPerioderMedBarn,
    );
};
