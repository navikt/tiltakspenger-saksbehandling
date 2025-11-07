import { Periode } from './Periode';
import { Rammevedtak } from './Rammevedtak';

export interface Tidslinje {
    elementer: TidslinjeElement[];
}

export interface TidslinjeElement {
    rammevedtak: Rammevedtak;
    periode: Periode;
    tidslinjeResultat: TidslinjeResultat;
}

export enum TidslinjeResultat {
    STANS = 'STANS',
    FORLENGELSE = 'FORLENGELSE',
    SØKNADSBEHANDLING_INNVILGELSE = 'SØKNADSBEHANDLING_INNVILGELSE',
    REVURDERING_INNVILGELSE = 'REVURDERING_INNVILGELSE',
    OMGJØRING_INNVILGELSE = 'OMGJØRING_INNVILGELSE',
    OMGJØRING_OPPHØR = 'OMGJØRING_OPPHØR',
}
