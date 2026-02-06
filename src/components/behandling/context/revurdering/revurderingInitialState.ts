import {
    Omgjøring,
    OmgjøringResultat,
    Revurdering,
    RevurderingInnvilgelse,
    RevurderingResultat,
    RevurderingStans,
} from '~/types/Revurdering';
import { SakProps } from '~/types/Sak';
import { RevurderingStansState } from '~/components/behandling/context/revurdering/revurderingStansSkjemaContext';
import { hentBarnetilleggForRevurdering } from '~/components/behandling/felles/barnetillegg/utils/hentBarnetilleggFraBehandling';
import {
    OmgjøringInnvilgelseState,
    OmgjøringOpphørState,
    OmgjøringState,
} from '~/components/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { RevurderingInnvilgelseState } from '~/components/behandling/context/revurdering/revurderingInnvilgelseSkjemaContext';
import { hentRammevedtak } from '~/utils/sak';
import { totalPeriode } from '~/utils/periode';

type RevurderingState = RevurderingInnvilgelseState | RevurderingStansState | OmgjøringState;

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
        const perioderSomKanOmgjøres = hentRammevedtak(sak, behandling.omgjørVedtak)
            ?.gyldigeKommandoer.OMGJØR?.perioderSomKanOmgjøres;

        const vedtaksperiode =
            behandling.vedtaksperiode ??
            (perioderSomKanOmgjøres ? totalPeriode(perioderSomKanOmgjøres) : undefined);

        if (!vedtaksperiode) {
            throw new Error(
                'Kan ikke omgjøre et vedtak som ikke har gjeldende perioder som kan omgjøres',
            );
        }

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
    const { vedtaksperiode, omgjørVedtak } = behandling;

    if (vedtaksperiode) {
        return {
            resultat: RevurderingResultat.OMGJØRING_OPPHØR,
            vedtaksperiode,
        };
    }

    const perioderSomKanOpphøres = hentRammevedtak(sak, omgjørVedtak)?.gyldigeKommandoer.OPPHØR
        ?.innvilgelsesperioder;

    if (!perioderSomKanOpphøres) {
        throw Error('Kan ikke opphøre et vedtak som ikke har gjeldende innvilgelsesperioder');
    }

    return {
        resultat: RevurderingResultat.OMGJØRING_OPPHØR,
        vedtaksperiode: totalPeriode(perioderSomKanOpphøres),
    };
};
