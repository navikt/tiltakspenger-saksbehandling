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

export const finnNesteKlageSteg = (k: Klagebehandling, fra: KlageSteg): string => {
    switch (fra) {
        case KlageSteg.FORMKRAV: {
            if (k.resultat === KlagebehandlingResultat.AVVIST) {
                return `/sak/${k.saksnummer}/klage/${k.id}/brev`;
            }

            return `/sak/${k.saksnummer}/klage/${k.id}/vurdering`;
        }

        case KlageSteg.VURDERING: {
            if (k.resultat === KlagebehandlingResultat.OMGJØR) {
                return `/sak/${k.saksnummer}/klage/${k.id}/resultat`;
            }

            if (k.resultat === KlagebehandlingResultat.OPPRETTHOLDT) {
                return `/sak/${k.saksnummer}/klage/${k.id}/brev`;
            }

            return `/sak/${k.saksnummer}/klage/${k.id}/vurdering`;
        }
        case KlageSteg.BREV: {
            return `/sak/${k.saksnummer}/klage/${k.id}/resultat`;
        }
        case KlageSteg.RESULTAT: {
            return `/sak/${k.saksnummer}/klage/${k.id}/resultat`;
        }
    }
};

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
