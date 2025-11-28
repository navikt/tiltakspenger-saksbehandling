import { Periode } from '~/types/Periode';
import { Tiltaksdeltagelse, TiltaksdeltagelseMedPeriode } from '~/types/TiltakDeltagelseTypes';
import { erDatoIPeriode, joinPerioder, perioderOverlapper } from './periode';
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

export const deltarPaFlereTiltakMedStartOgSluttdatoIValgtInnvilgelsesperiode = (
    behandling: Rammebehandling,
    innvilgelsesperiode: Periode,
) => {
    const tiltak = hentTiltaksdeltakelserMedStartOgSluttdato(behandling);

    if (tiltak.length <= 1) {
        return false;
    }

    const overlappendeDeltakelser: Tiltaksdeltagelse[] = [];

    tiltak.forEach((tiltaksdeltagelse) => {
        const periode: Periode = {
            fraOgMed: tiltaksdeltagelse.deltagelseFraOgMed,
            tilOgMed: tiltaksdeltagelse.deltagelseTilOgMed,
        };

        if (
            erDatoIPeriode(innvilgelsesperiode.fraOgMed, periode) ||
            erDatoIPeriode(innvilgelsesperiode.tilOgMed, periode)
        ) {
            overlappendeDeltakelser.push(tiltaksdeltagelse);
        }
    });

    return overlappendeDeltakelser.length > 1;
};

export const deltarPaFlereTiltakMedStartOgSluttdato = (behandling: Rammebehandling) =>
    hentTiltaksdeltakelserMedStartOgSluttdato(behandling).length > 1;

export const hentTiltaksdeltakelser = (behandling: Rammebehandling): Tiltaksdeltagelse[] =>
    behandling.saksopplysninger.tiltaksdeltagelse ?? [];

export const hentTiltaksdeltakelserMedStartOgSluttdato = (
    behandling: Rammebehandling,
): TiltaksdeltagelseMedPeriode[] =>
    hentTiltaksdeltakelser(behandling).filter(
        (t): t is TiltaksdeltagelseMedPeriode =>
            t.deltagelseFraOgMed != null && t.deltagelseTilOgMed != null,
    );

export const hentTiltaksdeltagelserFraPeriode = (behandling: Rammebehandling, periode: Periode) => {
    return hentTiltaksdeltakelserMedStartOgSluttdato(behandling).reduce<
        TiltaksdeltagelseMedPeriode[]
    >((acc, td) => {
        const { deltagelseFraOgMed, deltagelseTilOgMed } = td;

        const deltagelsesPeriode: Periode = {
            fraOgMed: deltagelseFraOgMed,
            tilOgMed: deltagelseTilOgMed,
        };

        if (perioderOverlapper(periode, deltagelsesPeriode)) {
            acc.push(td);
        }

        return acc;
    }, []);
};

export const hentHeleTiltaksdeltagelsesperioden = (behandling: Rammebehandling) => {
    const perioder = hentTiltaksdeltakelserMedStartOgSluttdato(behandling).map(
        (tiltaksdeltagelse) => ({
            fraOgMed: tiltaksdeltagelse.deltagelseFraOgMed,
            tilOgMed: tiltaksdeltagelse.deltagelseTilOgMed,
        }),
    );
    return joinPerioder(perioder);
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
