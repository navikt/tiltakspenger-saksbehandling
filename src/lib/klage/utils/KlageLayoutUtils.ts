import { Klagebehandling, KlagebehandlingResultat } from '~/lib/klage/typer/Klage';
import {
    erKlageOmgjøring,
    erKlageOpprettholdelse,
    erKlageOpprettholdtEllerEtter,
    kanVurdereKlage,
} from './klageUtils';
import { klagebehandlingUrl, KlageStegUrlSegment } from '~/utils/urls';

export enum KlageSteg {
    FORMKRAV = 'FORMKRAV',
    VURDERING = 'VURDERING',
    BREV = 'BREV',
    RESULTAT = 'RESULTAT',
}

export const finnNesteKlageSteg = (k: Klagebehandling, fra: KlageSteg): string => {
    switch (fra) {
        case KlageSteg.FORMKRAV: {
            if (k.resultat?.type === KlagebehandlingResultat.AVVIST) {
                return klagebehandlingUrl(k.saksnummer, k.id, KlageStegUrlSegment.Brev);
            }

            return klagebehandlingUrl(k.saksnummer, k.id, KlageStegUrlSegment.Vurdering);
        }

        case KlageSteg.VURDERING: {
            if (k.resultat?.type === KlagebehandlingResultat.OMGJØR) {
                return klagebehandlingUrl(k.saksnummer, k.id, KlageStegUrlSegment.Resultat);
            }

            if (k.resultat?.type === KlagebehandlingResultat.OPPRETTHOLDT) {
                return klagebehandlingUrl(k.saksnummer, k.id, KlageStegUrlSegment.Brev);
            }

            return klagebehandlingUrl(k.saksnummer, k.id, KlageStegUrlSegment.Vurdering);
        }
        case KlageSteg.BREV: {
            return klagebehandlingUrl(k.saksnummer, k.id, KlageStegUrlSegment.Resultat);
        }
        case KlageSteg.RESULTAT: {
            return klagebehandlingUrl(k.saksnummer, k.id, KlageStegUrlSegment.Resultat);
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
                klage.resultat?.type === KlagebehandlingResultat.AVVIST ||
                erKlageOpprettholdelse(klage)
            );
        case KlageSteg.RESULTAT:
            return erKlageOmgjøring(klage) || erKlageOpprettholdtEllerEtter(klage);
        default:
            return false;
    }
};
