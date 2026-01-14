import { Klagebehandling } from '~/types/Klage';

export enum KlageSteg {
    FORMKRAV = 'FORMKRAV',
    BREV = 'BREV',
}

export const kanNavigereTilKlageSteg = (klage: Klagebehandling, steg: KlageSteg): boolean => {
    switch (steg) {
        case KlageSteg.FORMKRAV:
            return true;
        case KlageSteg.BREV:
            return klage.resultat !== null;
        default:
            return false;
    }
};
