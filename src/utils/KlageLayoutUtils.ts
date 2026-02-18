import { Klagebehandling, KlagebehandlingResultat } from '~/types/Klage';
import {
    erKlageOmgjøring,
    erKlageOpprettholdelse,
    erKlageOpprettholdtEllerEtter,
    kanVurdereKlage,
} from './klageUtils';

export enum KlageSteg {
    FORMKRAV = 'FORMKRAV',
    VURDERING = 'VURDERING',
    BREV = 'BREV',
    RESULTAT = 'RESULTAT',
}

export const kanNavigereTilKlageSteg = (klage: Klagebehandling, steg: KlageSteg): boolean => {
    switch (steg) {
        case KlageSteg.FORMKRAV:
            return true;
        case KlageSteg.VURDERING:
            return kanVurdereKlage(klage);
        case KlageSteg.BREV:
            return (
                klage.resultat === KlagebehandlingResultat.AVVIST || erKlageOpprettholdelse(klage)
            );
        case KlageSteg.RESULTAT:
            return erKlageOmgjøring(klage) || erKlageOpprettholdtEllerEtter(klage.status);
        default:
            return false;
    }
};
