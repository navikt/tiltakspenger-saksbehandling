import {
    Omgjøring,
    OmgjøringResultat,
    Revurdering,
    RevurderingInnvilgelse,
    RevurderingResultat,
    RevurderingStans,
} from '~/lib/rammebehandling/typer/Revurdering';
import { SakProps } from '~/lib/sak/SakTyper';
import { RevurderingStansState } from '~/lib/rammebehandling/context/revurdering/revurderingStansSkjemaContext';
import { hentBarnetilleggForRevurdering } from '~/lib/rammebehandling/felles/barnetillegg/utils/hentBarnetilleggFraBehandling';
import {
    OmgjøringInnvilgelseState,
    OmgjøringOpphørState,
    OmgjøringState,
} from '~/lib/rammebehandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { RevurderingInnvilgelseState } from '~/lib/rammebehandling/context/revurdering/revurderingInnvilgelseSkjemaContext';
import {
    forlengelseInitialState,
    RevurderingForlengelseState,
} from '~/lib/rammebehandling/context/revurdering/revurderingForlengelseSkjemaContext';
import { overlappendePeriode, periodiseringTotalPeriode, totalPeriode } from '~/utils/periode';
import { Periode } from '~/types/Periode';
import { isNonNullish } from '~/utils/object';

type RevurderingState =
    | RevurderingInnvilgelseState
    | RevurderingForlengelseState
    | RevurderingStansState
    | OmgjøringState;

export const revurderingInitialState = (
    behandling: Revurdering,
    sak: SakProps,
): RevurderingState => {
    const { resultat } = behandling;

    switch (resultat) {
        case RevurderingResultat.INNVILGELSE: {
            return innvilgelseInitialState(behandling, sak);
        }

        case RevurderingResultat.STANS: {
            return stansInitialState(behandling);
        }

        case RevurderingResultat.FORLENGELSE: {
            return forlengelseInitialState(behandling);
        }

        case RevurderingResultat.OMGJØRING:
        case RevurderingResultat.OMGJØRING_OPPHØR:
        case RevurderingResultat.OMGJØRING_IKKE_VALGT: {
            return omgjøringInitialState(behandling, sak);
        }
    }

    throw new Error(`Ukjent revurdering resultat: ${resultat satisfies never}`);
};

const stansInitialState = (behandling: RevurderingStans): RevurderingStansState => {
    return {
        resultat: RevurderingResultat.STANS,
        fraDato: behandling.vedtaksperiode?.fraOgMed,
        hjemlerForStans: behandling.valgtHjemmelHarIkkeRettighet ?? [],
        harValgtStansFraFørsteDagSomGirRett:
            behandling.harValgtStansFraFørsteDagSomGirRett ?? false,
    };
};

const innvilgelseInitialState = (
    behandling: RevurderingInnvilgelse,
    sak: SakProps,
): RevurderingInnvilgelseState => {
    const { innvilgelsesperioder } = behandling;

    if (!innvilgelsesperioder) {
        return {
            resultat: RevurderingResultat.INNVILGELSE,
            innvilgelse: {
                harValgtPeriode: false,
                innvilgelsesperioder: [
                    {
                        periode: {},
                    },
                ],
            },
        };
    }

    const barnetilleggPerioder = hentBarnetilleggForRevurdering(
        behandling,
        innvilgelsesperioder,
        sak,
    );

    return {
        resultat: RevurderingResultat.INNVILGELSE,
        innvilgelse: {
            harValgtPeriode: true,
            innvilgelsesperioder,
            harBarnetillegg: barnetilleggPerioder.length > 0,
            barnetilleggPerioder,
        },
    };
};

export const omgjøringInitialState = (
    behandling: Omgjøring,
    sak: SakProps,
    // Kan sette resultat separat fra det som er lagret på behandlingen, ettersom vi må
    // kunne sette initial state for nytt resultat når saksbehandler endrer resultatet
    resultat: OmgjøringResultat = behandling.resultat,
): OmgjøringState => {
    switch (resultat) {
        case RevurderingResultat.OMGJØRING_IKKE_VALGT: {
            return {
                resultat: RevurderingResultat.OMGJØRING_IKKE_VALGT,
            };
        }

        case RevurderingResultat.OMGJØRING: {
            return omgjøringInnvilgelseInitialState(behandling, sak);
        }

        case RevurderingResultat.OMGJØRING_OPPHØR: {
            return omgjøringOpphørInitialState(behandling, sak);
        }
    }

    throw new Error(`Ukjent omgjøring resultat: ${resultat satisfies never}`);
};

const omgjøringInnvilgelseInitialState = (
    behandling: Omgjøring,
    sak: SakProps,
): OmgjøringInnvilgelseState => {
    if (behandling.resultat !== RevurderingResultat.OMGJØRING) {
        const vedtaksperiode: Partial<Periode> =
            behandling.vedtaksperiode ?? forhåndsutfyltOmgjøringsperiode(behandling) ?? {};

        return {
            resultat: RevurderingResultat.OMGJØRING,
            vedtaksperiode,
            innvilgelse: {
                harValgtPeriode: false,
                innvilgelsesperioder: [
                    {
                        periode: {},
                    },
                ],
            },
        };
    }

    const { innvilgelsesperioder, vedtaksperiode } = behandling;

    if (!innvilgelsesperioder) {
        return {
            resultat: RevurderingResultat.OMGJØRING,
            vedtaksperiode,
            innvilgelse: {
                harValgtPeriode: false,
                innvilgelsesperioder: [
                    {
                        periode: {},
                    },
                ],
            },
        };
    }

    const barnetilleggPerioder = hentBarnetilleggForRevurdering(
        behandling,
        innvilgelsesperioder,
        sak,
    );

    return {
        resultat: RevurderingResultat.OMGJØRING,
        vedtaksperiode,
        innvilgelse: {
            harValgtPeriode: true,
            innvilgelsesperioder,
            harBarnetillegg: barnetilleggPerioder.length > 0,
            barnetilleggPerioder,
        },
    };
};

const omgjøringOpphørInitialState = (
    behandling: Omgjøring,
    sak: SakProps,
): OmgjøringOpphørState => {
    if (behandling.resultat === RevurderingResultat.OMGJØRING_OPPHØR) {
        return {
            resultat: RevurderingResultat.OMGJØRING_OPPHØR,
            vedtaksperiode: behandling.vedtaksperiode,
            valgteHjemler: behandling.valgteHjemler,
        };
    }

    const forhåndsutfyltPeriode = forhåndsutfyltOmgjøringsperiode(behandling);

    // Opphøret må starte og slutte i en innvilgelse, så den forhåndsutfylte perioden avgrenses til de innvilgede periodene i den.
    const perioderSomKanOpphøres = forhåndsutfyltPeriode
        ? sak.innvilgetTidslinje.elementer
              .map((it) => overlappendePeriode(it.periode, forhåndsutfyltPeriode))
              .filter(isNonNullish)
        : [];

    return {
        resultat: RevurderingResultat.OMGJØRING_OPPHØR,
        vedtaksperiode:
            perioderSomKanOpphøres.length > 0 ? totalPeriode(perioderSomKanOpphøres) : {},
        valgteHjemler: [],
    };
};

// En omgjøring som er startet fra et vedtak er forhåndsutfylt av backend med perioden til vedtaket.
// En omgjøring startet fra menyen omgjør ingen vedtak ennå, og saksbehandler må selv velge vedtaksperioden.
const forhåndsutfyltOmgjøringsperiode = (behandling: Omgjøring): Periode | undefined =>
    behandling.omgjørRammevedtak.length > 0
        ? periodiseringTotalPeriode(behandling.omgjørRammevedtak)
        : undefined;
