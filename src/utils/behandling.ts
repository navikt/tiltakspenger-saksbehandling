import {
    BehandlingData,
    BehandlingStatus,
    Behandlingstype,
    FørstegangsbehandlingData,
} from '../types/BehandlingTypes';
import { Periode } from '../types/Periode';
import { singleOrFirst } from './array';
import { Tiltaksdeltagelse } from '../types/TiltakDeltagelseTypes';

export const hentTiltaksperiode = (behandling: FørstegangsbehandlingData): Periode => {
    const forsteStartdatoForDeltakelse = finnForsteStartdatoForTiltaksdeltakelse(behandling);
    const sisteSluttdatoForDeltakelse = finnSisteSluttdatoForTiltaksdeltakelse(behandling);
    const tiltakFraSøknad = singleOrFirst(behandling.søknad.tiltak);

    return {
        fraOgMed: forsteStartdatoForDeltakelse ?? tiltakFraSøknad.fraOgMed,
        tilOgMed: sisteSluttdatoForDeltakelse ?? tiltakFraSøknad.tilOgMed,
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

export const deltarPaFlereTiltak = (behandling: FørstegangsbehandlingData) =>
    behandling.saksopplysninger.tiltaksdeltagelse.length > 1;

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
