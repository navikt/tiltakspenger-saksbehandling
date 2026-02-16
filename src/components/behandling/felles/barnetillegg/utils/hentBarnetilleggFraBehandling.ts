import { periodiserBarnetilleggFraSøknad } from '~/components/behandling/felles/barnetillegg/utils/periodiserBarnetilleggFraSøknad';
import { rammebehandlingMedInnvilgelseEllerNull } from '~/utils/behandling';
import { hentBarnetilleggFraVedtakKunMedBarn } from '~/components/behandling/felles/barnetillegg/utils/hentBarnetilleggFraVedtakTidslinje';
import { SakProps } from '~/types/Sak';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import {
    kunPerioderMedBarn,
    slåSammenBarnetillegg,
} from '~/components/behandling/felles/barnetillegg/utils/barnetilleggUtils';
import { Søknadsbehandling } from '~/types/Søknadsbehandling';
import { Revurdering } from '~/types/Revurdering';
import { Rammebehandling, Rammebehandlingstype } from '~/types/Rammebehandling';
import { TidslinjeRammevedtak } from '~/types/TidslinjeRammevedtak';
import { Innvilgelsesperiode } from '~/types/Innvilgelsesperiode';
import { utvidPeriodisering } from '~/utils/periode';

export const hentBarnetilleggForSøknadsbehandling = (
    behandling: Søknadsbehandling,
    innvilgelsesperioder: Innvilgelsesperiode[],
): BarnetilleggPeriode[] => {
    return (
        hentLagredePerioderMedBarn(behandling) ||
        periodiserBarnetilleggFraSøknad(behandling.søknad.barnetillegg, innvilgelsesperioder)
    );
};

export const hentBarnetilleggForRevurdering = (
    behandling: Revurdering,
    innvilgelsesperioder: Innvilgelsesperiode[],
    sak: SakProps,
): BarnetilleggPeriode[] => {
    return (
        hentLagredePerioderMedBarn(behandling) ||
        hentBarnetilleggForhåndsutfyltForRevurdering(sak.tidslinje, innvilgelsesperioder)
    );
};

export const hentBarnetilleggForhåndsutfyltForRevurdering = (
    tidslinje: TidslinjeRammevedtak,
    innvilgelsesperioder: Innvilgelsesperiode[],
) => {
    const btFraVedtak = hentBarnetilleggFraVedtakKunMedBarn(tidslinje);

    const btPerioder = innvilgelsesperioder.flatMap((ip) =>
        utvidPeriodisering(btFraVedtak, ip.periode, true),
    );

    return slåSammenBarnetillegg(btPerioder);
};

export const hentBarnetilleggForBehandling = (
    behandling: Rammebehandling,
    innvilgelsesperioder: Innvilgelsesperiode[],
    sak: SakProps,
): BarnetilleggPeriode[] => {
    return behandling.type === Rammebehandlingstype.SØKNADSBEHANDLING
        ? hentBarnetilleggForSøknadsbehandling(behandling, innvilgelsesperioder)
        : hentBarnetilleggForRevurdering(behandling, innvilgelsesperioder, sak);
};

export const hentLagredePerioderMedBarn = (
    behandling: Rammebehandling,
): BarnetilleggPeriode[] | undefined => {
    return rammebehandlingMedInnvilgelseEllerNull(behandling)?.barnetillegg?.perioder.filter(
        kunPerioderMedBarn,
    );
};
