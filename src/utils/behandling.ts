import {
    BehandlingData,
    BehandlingStatus,
    Behandlingstype,
    FørstegangsbehandlingData,
} from '../types/BehandlingTypes';
import { Periode } from '../types/Periode';
import { singleOrFirst } from './array';

export const hentTiltaksperiode = (behandling: FørstegangsbehandlingData): Periode => {
    const tiltakFraSaksopplysning = singleOrFirst(behandling.saksopplysninger.tiltaksdeltagelse);
    const tiltakFraSøknad = singleOrFirst(behandling.søknad.tiltak);

    return {
        fraOgMed: tiltakFraSaksopplysning.deltagelseFraOgMed ?? tiltakFraSøknad.fraOgMed,
        tilOgMed: tiltakFraSaksopplysning.deltagelseTilOgMed ?? tiltakFraSøknad.tilOgMed,
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
