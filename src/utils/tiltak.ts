import { FørstegangsbehandlingData } from '../types/BehandlingTypes';
import { Periode } from '../types/Periode';

export const hentTiltaksPeriode = (behandling: FørstegangsbehandlingData): Periode => {
    return {
        fraOgMed:
            behandling.saksopplysninger.tiltaksdeltagelse.deltagelseFraOgMed ??
            behandling.søknad.tiltak.fraOgMed,
        tilOgMed:
            behandling.saksopplysninger.tiltaksdeltagelse.deltagelseTilOgMed ??
            behandling.søknad.tiltak.tilOgMed,
    };
};
