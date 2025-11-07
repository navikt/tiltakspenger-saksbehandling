import { TidslinjeResultat } from '~/types/Tidslinje';

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
