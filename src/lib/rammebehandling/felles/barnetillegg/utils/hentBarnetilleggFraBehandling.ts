import { periodiserBarnetilleggFraSøknad } from '~/lib/rammebehandling/felles/barnetillegg/utils/periodiserBarnetilleggFraSøknad';
import { rammebehandlingMedInnvilgelseEllerNull } from '~/lib/rammebehandling/rammebehandlingUtils';
import { hentBarnetilleggFraVedtakKunMedBarn } from '~/lib/rammebehandling/felles/barnetillegg/utils/hentBarnetilleggFraVedtakTidslinje';
import { SakProps } from '~/lib/sak/SakTyper';
import { BarnetilleggPeriode } from '~/lib/rammebehandling/typer/Barnetillegg';
import {
    kunPerioderMedBarn,
    slåSammenBarnetillegg,
} from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggUtils';
import { Søknadsbehandling } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { Revurdering } from '~/lib/rammebehandling/typer/Revurdering';
import { Rammebehandling, Rammebehandlingstype } from '~/lib/rammebehandling/typer/Rammebehandling';
import { TidslinjeRammevedtak } from '~/types/TidslinjeRammevedtak';
import { Innvilgelsesperiode } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
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
