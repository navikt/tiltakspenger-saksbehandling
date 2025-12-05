import { TidslinjeResultat } from '~/types/TidslinjeRammevedtak';
import { TimelinePeriodProps } from '@navikt/ds-react';

export const erTidslinjeElementInnvilgelse = (r: TidslinjeResultat): boolean => {
    switch (r) {
        case TidslinjeResultat.SØKNADSBEHANDLING_INNVILGELSE:
        case TidslinjeResultat.REVURDERING_INNVILGELSE:
        case TidslinjeResultat.OMGJØRING_INNVILGELSE:
            return true;
        default:
            return false;
    }
};

export const tidslinjeResultatTekst: Record<TidslinjeResultat, string> = {
    [TidslinjeResultat.STANS]: 'Stanset',
    [TidslinjeResultat.OMGJØRING_OPPHØR]: 'Omgjøring - opphørt',
    [TidslinjeResultat.FORLENGELSE]: 'Forlengelse',
    [TidslinjeResultat.SØKNADSBEHANDLING_INNVILGELSE]: 'Søknadsbehandling - innvilgelse',
    [TidslinjeResultat.REVURDERING_INNVILGELSE]: 'Revurdering - innvilgelse',
    [TidslinjeResultat.OMGJØRING_INNVILGELSE]: 'Omgjøring - innvilgelse',
} as const;

export const tidslinjeResultatStatus: Record<TidslinjeResultat, TimelinePeriodProps['status']> = {
    [TidslinjeResultat.STANS]: 'warning',
    [TidslinjeResultat.OMGJØRING_OPPHØR]: 'danger',
    [TidslinjeResultat.FORLENGELSE]: 'success',
    [TidslinjeResultat.SØKNADSBEHANDLING_INNVILGELSE]: 'success',
    [TidslinjeResultat.REVURDERING_INNVILGELSE]: 'success',
    [TidslinjeResultat.OMGJØRING_INNVILGELSE]: 'success',
} as const;
