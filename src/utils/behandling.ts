import {
    BehandlingData,
    BehandlingStatus,
    Behandlingstype,
    FørstegangsbehandlingData,
} from '../types/BehandlingTypes';
import { Periode } from '../types/Periode';
import { singleOrFirst } from './array';
import { Tiltaksdeltagelse } from '../types/TiltakDeltagelseTypes';
import { erDatoIPeriode } from './periode';

export const hentTiltaksperiode = (behandling: FørstegangsbehandlingData): Periode => {
    const forsteStartdatoForDeltakelse = finnForsteStartdatoForTiltaksdeltakelse(behandling);
    const sisteSluttdatoForDeltakelse = finnSisteSluttdatoForTiltaksdeltakelse(behandling);
    const tiltakFraSøknad = singleOrFirst(behandling.søknad.tiltak);

    return {
        fraOgMed: forsteStartdatoForDeltakelse ?? tiltakFraSøknad.fraOgMed,
        tilOgMed: sisteSluttdatoForDeltakelse ?? tiltakFraSøknad.tilOgMed,
    };
};

export const hentTiltaksperiodeFraSøknad = (behandling: FørstegangsbehandlingData): Periode => {
    const tiltakFraSøknad = singleOrFirst(behandling.søknad.tiltak);

    return {
        fraOgMed: tiltakFraSøknad.fraOgMed,
        tilOgMed: tiltakFraSøknad.tilOgMed,
    };
};

export const harSøktBarnetillegg = (behandling: FørstegangsbehandlingData) =>
    !!behandling.barnetillegg || behandling.søknad.barnetillegg.length > 0;

export const erBehandlingAbrutt = (behandling: BehandlingData) => !!behandling.avbrutt;

export const erBehandlingVedtatt = (behandling: BehandlingData) =>
    behandling.status === BehandlingStatus.VEDTATT;

export const erBehandlingFørstegangsbehandling = (
    behandling: BehandlingData,
): behandling is FørstegangsbehandlingData =>
    behandling.type === Behandlingstype.FØRSTEGANGSBEHANDLING;

export const deltarPaFlereTiltakMedStartOgSluttdatoIValgtInnvilgelsesperiode = (
    behandling: FørstegangsbehandlingData,
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

export const deltarPaFlereTiltakMedStartOgSluttdato = (behandling: FørstegangsbehandlingData) =>
    hentTiltaksdeltakelserMedStartOgSluttdato(behandling).length > 1;

export const hentTiltaksdeltagelseFraSoknad = (behandling: FørstegangsbehandlingData) => {
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

export const hentTiltaksdeltakelser = (
    behandling: FørstegangsbehandlingData,
): Tiltaksdeltagelse[] => behandling.saksopplysninger.tiltaksdeltagelse;

export const hentTiltaksdeltakelserMedStartOgSluttdato = (
    behandling: FørstegangsbehandlingData,
): Tiltaksdeltagelse[] =>
    hentTiltaksdeltakelser(behandling).filter(
        (t) => t.deltagelseFraOgMed != null && t.deltagelseTilOgMed != null,
    );

export const finnForsteStartdatoForTiltaksdeltakelse = (
    behandling: FørstegangsbehandlingData,
): string | null => {
    const sorterteDeltakelser = hentTiltaksdeltakelser(behandling)
        .filter((t) => t.deltagelseFraOgMed != null)
        .sort((a, b) => (b.deltagelseFraOgMed! > a.deltagelseFraOgMed! ? -1 : 1));
    return sorterteDeltakelser[0]?.deltagelseFraOgMed;
};

export const finnSisteSluttdatoForTiltaksdeltakelse = (
    behandling: FørstegangsbehandlingData,
): string | null => {
    const sorterteDeltakelser = hentTiltaksdeltakelser(behandling)
        .filter((t) => t.deltagelseTilOgMed != null)
        .sort((a, b) => (a.deltagelseTilOgMed! > b.deltagelseTilOgMed! ? -1 : 1));
    return sorterteDeltakelser[0]?.deltagelseTilOgMed;
};
