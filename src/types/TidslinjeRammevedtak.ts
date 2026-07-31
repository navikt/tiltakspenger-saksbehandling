import { Periode } from './Periode';
import { VedtakId } from '~/lib/rammebehandling/typer/Rammevedtak';

export type TidslinjeRammevedtak = {
    elementer: TidslinjeElement[];
};

type TidslinjeElement = {
    rammevedtakId: VedtakId;
    periode: Periode;
    tidslinjeResultat: TidslinjeResultat;
};

export enum TidslinjeResultat {
    STANS = 'STANS',
    FORLENGELSE = 'FORLENGELSE',
    SØKNADSBEHANDLING_INNVILGELSE = 'SØKNADSBEHANDLING_INNVILGELSE',
    REVURDERING_INNVILGELSE = 'REVURDERING_INNVILGELSE',
    OMGJØRING_INNVILGELSE = 'OMGJØRING_INNVILGELSE',
    OMGJØRING_OPPHØR = 'OMGJØRING_OPPHØR',
}
