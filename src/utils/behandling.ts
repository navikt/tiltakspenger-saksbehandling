import { FørstegangsbehandlingData } from '../types/BehandlingTypes';
import { Periode } from '../types/Periode';
import { singleOrFirst } from './array';

export const hentTiltaksPeriode = (behandling: FørstegangsbehandlingData): Periode => {
    return {
        fraOgMed:
            singleOrFirst(behandling.saksopplysninger.tiltaksdeltagelse).deltagelseFraOgMed ??
            singleOrFirst(behandling.søknad.tiltak).fraOgMed,
        tilOgMed:
            singleOrFirst(behandling.saksopplysninger.tiltaksdeltagelse).deltagelseTilOgMed ??
            singleOrFirst(behandling.søknad.tiltak).tilOgMed,
    };
};

export const harSøktBarnetillegg = (behandling: FørstegangsbehandlingData) =>
    !!behandling.barnetillegg || behandling.søknad.barnetillegg.length > 0;
