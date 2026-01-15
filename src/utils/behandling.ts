import { Periode } from '~/types/Periode';
import { Tiltaksdeltakelse, TiltaksdeltakelseMedPeriode } from '~/types/TiltakDeltakelse';
import { totalPeriode, perioderOverlapper } from './periode';
import { Nullable } from '~/types/UtilTypes';
import {
    Rammebehandling,
    RammebehandlingMedInnvilgelse,
    RammebehandlingResultat,
} from '~/types/Rammebehandling';
import { Søknadsbehandling, SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';
import { RevurderingResultat } from '~/types/Revurdering';

export const hentTiltaksperiode = (behandling: Søknadsbehandling): Nullable<Periode> => {
    const forsteStartdatoForDeltakelse = finnForsteStartdatoForTiltaksdeltakelse(behandling);
    const sisteSluttdatoForDeltakelse = finnSisteSluttdatoForTiltaksdeltakelse(behandling);
    const tiltakFraSøknad = behandling.søknad.tiltak;

    if (forsteStartdatoForDeltakelse && sisteSluttdatoForDeltakelse) {
        return {
            fraOgMed: forsteStartdatoForDeltakelse,
            tilOgMed: sisteSluttdatoForDeltakelse,
        };
    } else if (tiltakFraSøknad?.fraOgMed && tiltakFraSøknad?.tilOgMed) {
        return {
            fraOgMed: tiltakFraSøknad.fraOgMed,
            tilOgMed: tiltakFraSøknad.tilOgMed,
        };
    }
    return null;
};

export const deltarPaFlereTiltakMedStartOgSluttdato = (behandling: Rammebehandling) =>
    hentTiltaksdeltakelserMedStartOgSluttdato(behandling).length > 1;

export const hentTiltaksdeltakelser = (behandling: Rammebehandling): Tiltaksdeltakelse[] =>
    behandling.saksopplysninger.tiltaksdeltagelse ?? [];

export const hentTiltaksdeltakelserMedStartOgSluttdato = (
    behandling: Rammebehandling,
): TiltaksdeltakelseMedPeriode[] =>
    hentTiltaksdeltakelser(behandling)
        .filter(
            (t): t is TiltaksdeltakelseMedPeriode =>
                t.deltagelseFraOgMed != null && t.deltagelseTilOgMed != null,
        )
        .map((t) => {
            return {
                ...t,
                periode: {
                    fraOgMed: t.deltagelseFraOgMed,
                    tilOgMed: t.deltagelseTilOgMed,
                },
            };
        });

export const hentTiltaksdeltakelserFraPeriode = (
    behandling: Rammebehandling,
    periode: Periode,
): TiltaksdeltakelseMedPeriode[] => {
    return hentTiltaksdeltakelserMedStartOgSluttdato(behandling).reduce<
        TiltaksdeltakelseMedPeriode[]
    >((acc, td) => {
        const { deltagelseFraOgMed, deltagelseTilOgMed } = td;

        const deltakelsesperiode: Periode = {
            fraOgMed: deltagelseFraOgMed,
            tilOgMed: deltagelseTilOgMed,
        };

        if (perioderOverlapper(periode, deltakelsesperiode)) {
            acc.push({ ...td, periode: deltakelsesperiode });
        }

        return acc;
    }, []);
};

export const hentHeleTiltaksdeltakelsesperioden = (behandling: Rammebehandling) => {
    const perioder = hentTiltaksdeltakelserMedStartOgSluttdato(behandling).map(
        (tiltaksdeltakelse) => ({
            fraOgMed: tiltaksdeltakelse.deltagelseFraOgMed,
            tilOgMed: tiltaksdeltakelse.deltagelseTilOgMed,
        }),
    );
    return totalPeriode(perioder);
};

export const finnForsteStartdatoForTiltaksdeltakelse = (
    behandling: Rammebehandling,
): string | null => {
    const sorterteDeltakelser = hentTiltaksdeltakelser(behandling)
        .filter((t) => t.deltagelseFraOgMed != null)
        .sort((a, b) => (b.deltagelseFraOgMed! > a.deltagelseFraOgMed! ? -1 : 1));
    return sorterteDeltakelser[0]?.deltagelseFraOgMed;
};

export const finnSisteSluttdatoForTiltaksdeltakelse = (
    behandling: Rammebehandling,
): string | null => {
    const sorterteDeltakelser = hentTiltaksdeltakelser(behandling)
        .filter((t) => t.deltagelseTilOgMed != null)
        .sort((a, b) => (a.deltagelseTilOgMed! > b.deltagelseTilOgMed! ? -1 : 1));
    return sorterteDeltakelser[0]?.deltagelseTilOgMed;
};

export const erRammebehandlingMedInnvilgelse = (
    behandling: Rammebehandling,
): behandling is RammebehandlingMedInnvilgelse => {
    const { resultat } = behandling;

    return erRammebehandlingInnvilgelseResultat(resultat);
};

export const rammebehandlingMedInnvilgelseEllerNull = (
    behandling: Rammebehandling,
): RammebehandlingMedInnvilgelse | null => {
    return erRammebehandlingMedInnvilgelse(behandling) ? behandling : null;
};

export const erRammebehandlingInnvilgelseResultat = (resultat: RammebehandlingResultat) => {
    return (
        resultat === SøknadsbehandlingResultat.INNVILGELSE ||
        resultat === RevurderingResultat.INNVILGELSE ||
        resultat === RevurderingResultat.OMGJØRING
    );
};

export const erSøknadsbehandlingResultat = (
    resultat: RammebehandlingResultat,
): resultat is SøknadsbehandlingResultat => {
    return (
        resultat === SøknadsbehandlingResultat.INNVILGELSE ||
        resultat === SøknadsbehandlingResultat.AVSLAG ||
        resultat === SøknadsbehandlingResultat.IKKE_VALGT
    );
};
