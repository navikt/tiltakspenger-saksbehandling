import { TidslinjeResultat } from '~/types/TidslinjeRammevedtak';
import { TimelinePeriodProps } from '@navikt/ds-react';
import { Rammevedtak } from '~/types/Rammevedtak';
import { minOgMax, NumberRange } from '~/utils/tall';

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

export const tellAntallBarnFraVedtak = (vedtak: Rammevedtak): NumberRange => {
    if (!vedtak.barnetillegg) {
        return {
            min: 0,
            max: 0,
        };
    }

    const antallBarnFraAllePerioder = vedtak.barnetillegg.perioder.map((bt) => bt.antallBarn);

    return minOgMax(antallBarnFraAllePerioder);
};

export const tellAntallDagerFraVedtak = (vedtak: Rammevedtak): NumberRange => {
    if (!vedtak.innvilgelsesperioder) {
        return {
            min: 0,
            max: 0,
        };
    }

    const fraAllePerioder = vedtak.innvilgelsesperioder.map((it) => it.antallDagerPerMeldeperiode);

    return minOgMax(fraAllePerioder);
};
