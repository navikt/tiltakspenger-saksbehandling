import { BehandlingData, RevurderingData, SøknadsbehandlingData } from '~/types/BehandlingTypes';
import { periodiserBarnetilleggFraSøknad } from '~/components/behandling/felles/barnetillegg/utils/periodiserBarnetilleggFraSøknad';
import { hentTiltaksperiodeFraSøknad } from '~/utils/behandling';
import { hentBarnetilleggPerioderMedBarn } from '~/components/behandling/felles/barnetillegg/utils/hentBarnetilleggFraVedtakTidslinje';
import { SakProps } from '~/types/SakTypes';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { kunPerioderMedBarn } from '~/components/behandling/felles/barnetillegg/utils/barnetilleggUtils';
import { Periode } from '~/types/Periode';

export const hentBarnetilleggForSøknadsbehandling = (
    behandling: SøknadsbehandlingData,
): BarnetilleggPeriode[] => {
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
    behandling: RevurderingData,
    sak: SakProps,
): BarnetilleggPeriode[] => {
    return (
        hentLagredePerioderMedBarn(behandling) ||
        hentBarnetilleggPerioderMedBarn(sak.tidslinje, periode)
    );
};

export const hentLagredePerioderMedBarn = (
    behandling: BehandlingData,
): BarnetilleggPeriode[] | undefined => {
    return behandling.barnetillegg?.perioder.filter(kunPerioderMedBarn);
};
