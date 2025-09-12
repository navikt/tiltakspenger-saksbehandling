import {
    BehandlingData,
    BehandlingStatus,
    Behandlingstype,
    SøknadsbehandlingData,
} from '~/types/BehandlingTypes';
import { Periode } from '~/types/Periode';
import { singleOrFirst } from './array';
import { Tiltaksdeltagelse, TiltaksdeltagelseMedPeriode } from '~/types/TiltakDeltagelseTypes';
import { erDatoIPeriode, joinPerioder } from './periode';

export const hentTiltaksperiode = (behandling: SøknadsbehandlingData): Periode => {
    const forsteStartdatoForDeltakelse = finnForsteStartdatoForTiltaksdeltakelse(behandling);
    const sisteSluttdatoForDeltakelse = finnSisteSluttdatoForTiltaksdeltakelse(behandling);
    const tiltakFraSøknad = singleOrFirst(behandling.søknad.tiltak);

    return {
        fraOgMed: forsteStartdatoForDeltakelse ?? tiltakFraSøknad.fraOgMed,
        tilOgMed: sisteSluttdatoForDeltakelse ?? tiltakFraSøknad.tilOgMed,
    };
};

export const hentTiltaksperiodeFraSøknad = (behandling: SøknadsbehandlingData): Periode => {
    const tiltakFraSøknad = singleOrFirst(behandling.søknad.tiltak);

    return {
        fraOgMed: tiltakFraSøknad.fraOgMed,
        tilOgMed: tiltakFraSøknad.tilOgMed,
    };
};

export const harSøktBarnetillegg = (behandling: BehandlingData) =>
    !!behandling.barnetillegg ||
    (erBehandlingSøknadsbehandling(behandling) && behandling.søknad.barnetillegg.length > 0);

export const erBehandlingAvbrutt = (behandling: BehandlingData) => !!behandling.avbrutt;

export const erBehandlingVedtatt = (behandling: BehandlingData) =>
    behandling.status === BehandlingStatus.VEDTATT;

export const erBehandlingSøknadsbehandling = (
    behandling: BehandlingData,
): behandling is SøknadsbehandlingData => behandling.type === Behandlingstype.SØKNADSBEHANDLING;

export const deltarPaFlereTiltakMedStartOgSluttdatoIValgtInnvilgelsesperiode = (
    behandling: BehandlingData,
    innvilgelsesperiode?: Periode,
) => {
    const tiltak = hentTiltaksdeltakelserMedStartOgSluttdato(behandling);
    if (tiltak.length <= 1) {
        return false;
    }

    const fom = innvilgelsesperiode?.fraOgMed;
    const tom = innvilgelsesperiode?.tilOgMed;
    if (fom && tom) {
        const overlappendeDeltakelser: Tiltaksdeltagelse[] = [];

        tiltak.forEach((tiltaksdeltagelse) => {
            const periode = {
                fraOgMed: tiltaksdeltagelse.deltagelseFraOgMed!,
                tilOgMed: tiltaksdeltagelse.deltagelseTilOgMed!,
            };
            if (erDatoIPeriode(fom, periode) || erDatoIPeriode(tom, periode)) {
                overlappendeDeltakelser.push(tiltaksdeltagelse);
            }
        });
        return overlappendeDeltakelser.length > 1;
    }
    return tiltak.length > 1;
};

export const deltarPaFlereTiltakMedStartOgSluttdato = (behandling: BehandlingData) =>
    hentTiltaksdeltakelserMedStartOgSluttdato(behandling).length > 1;

export const hentTiltaksdeltagelseFraSoknad = (behandling: SøknadsbehandlingData) => {
    const tiltakFraSoknad = singleOrFirst(behandling.søknad.tiltak);
    const tiltakFraSaksopplysninger = hentTiltaksdeltakelserMedStartOgSluttdato(behandling);

    const tiltaksdeltagelser = tiltakFraSaksopplysninger.filter(
        (t) => t.eksternDeltagelseId === tiltakFraSoknad.id,
    );
    return (
        singleOrFirst(tiltaksdeltagelser) ??
        singleOrFirst(behandling.saksopplysninger.tiltaksdeltagelse)
    );
};

export const hentTiltaksdeltakelser = (behandling: BehandlingData): Tiltaksdeltagelse[] =>
    behandling.saksopplysninger.tiltaksdeltagelse;

export const hentTiltaksdeltakelserMedStartOgSluttdato = (
    behandling: BehandlingData,
): TiltaksdeltagelseMedPeriode[] =>
    hentTiltaksdeltakelser(behandling).filter(
        (t): t is TiltaksdeltagelseMedPeriode =>
            t.deltagelseFraOgMed != null && t.deltagelseTilOgMed != null,
    );

export const hentHeleTiltaksdeltagelsesperioden = (behandling: BehandlingData) => {
    const perioder = hentTiltaksdeltakelserMedStartOgSluttdato(behandling).map(
        (tiltaksdeltagelse) => ({
            fraOgMed: tiltaksdeltagelse.deltagelseFraOgMed,
            tilOgMed: tiltaksdeltagelse.deltagelseTilOgMed,
        }),
    );
    return joinPerioder(perioder);
};

export const finnForsteStartdatoForTiltaksdeltakelse = (
    behandling: BehandlingData,
): string | null => {
    const sorterteDeltakelser = hentTiltaksdeltakelser(behandling)
        .filter((t) => t.deltagelseFraOgMed != null)
        .sort((a, b) => (b.deltagelseFraOgMed! > a.deltagelseFraOgMed! ? -1 : 1));
    return sorterteDeltakelser[0]?.deltagelseFraOgMed;
};

export const finnSisteSluttdatoForTiltaksdeltakelse = (
    behandling: BehandlingData,
): string | null => {
    const sorterteDeltakelser = hentTiltaksdeltakelser(behandling)
        .filter((t) => t.deltagelseTilOgMed != null)
        .sort((a, b) => (a.deltagelseTilOgMed! > b.deltagelseTilOgMed! ? -1 : 1));
    return sorterteDeltakelser[0]?.deltagelseTilOgMed;
};
