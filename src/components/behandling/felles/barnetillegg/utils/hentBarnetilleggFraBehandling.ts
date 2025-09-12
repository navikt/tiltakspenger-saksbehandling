import { BehandlingData, RevurderingData, SøknadsbehandlingData } from '~/types/BehandlingTypes';
import { periodiserBarnetillegg } from '~/components/behandling/felles/barnetillegg/utils/periodiserBarnetillegg';
import {
    hentHeleTiltaksdeltagelsesperioden,
    hentTiltaksperiodeFraSøknad,
} from '~/utils/behandling';
import { hentBarnetilleggFraVedtakTidslinje } from '~/components/behandling/felles/barnetillegg/utils/hentBarnetilleggFraVedtakTidslinje';
import { SakProps } from '~/types/SakTypes';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';

export const hentBarnetilleggForSøknadsbehandling = (
    behandling: SøknadsbehandlingData,
): BarnetilleggPeriode[] => {
    return (
        hentLagredePerioder(behandling) ||
        periodiserBarnetillegg(
            behandling.søknad.barnetillegg,
            behandling.virkningsperiode ?? hentTiltaksperiodeFraSøknad(behandling),
        )
    );
};

export const hentBarnetilleggForRevurdering = (
    behandling: RevurderingData,
    sak: SakProps,
): BarnetilleggPeriode[] => {
    return (
        hentLagredePerioder(behandling) ||
        hentBarnetilleggFraVedtakTidslinje(
            sak.tidslinje,
            behandling.virkningsperiode ?? hentHeleTiltaksdeltagelsesperioden(behandling),
        ).filter(filterPerioderMedBarn)
    );
};

const hentLagredePerioder = (behandling: BehandlingData): BarnetilleggPeriode[] | undefined => {
    return behandling.barnetillegg?.perioder.filter(filterPerioderMedBarn);
};

const filterPerioderMedBarn = (it: BarnetilleggPeriode) => it.antallBarn > 0;
