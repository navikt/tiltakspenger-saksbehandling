import {
    Revurdering,
    RevurderingInnvilgelse,
    RevurderingOmgjøring,
    RevurderingResultat,
    RevurderingStans,
} from '~/types/Revurdering';
import { SakProps } from '~/types/Sak';
import { RevurderingStansState } from '~/components/behandling/context/revurdering/revurderingStansSkjemaContext';
import { hentBarnetilleggForRevurdering } from '~/components/behandling/felles/barnetillegg/utils/hentBarnetilleggFraBehandling';
import { RevurderingOmgjøringState } from '~/components/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { RevurderingInnvilgelseState } from '~/components/behandling/context/revurdering/revurderingInnvilgelseSkjemaContext';

type RevurderingState =
    | RevurderingInnvilgelseState
    | RevurderingOmgjøringState
    | RevurderingStansState;

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
        case RevurderingResultat.OMGJØRING: {
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

const omgjøringInitialState = (
    behandling: RevurderingOmgjøring,
    sak: SakProps,
): RevurderingOmgjøringState => {
    const { innvilgelsesperioder } = behandling;

    if (!innvilgelsesperioder) {
        return {
            resultat: RevurderingResultat.OMGJØRING,
            innvilgelse: {
                harValgtPeriode: false,
                innvilgelsesperioder: [
                    {
                        periode: {},
                    },
                ],
            },
            vedtaksperiode: {
                skalOmgjøreHeleVedtaket: true,
                periode: null,
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
        innvilgelse: {
            harValgtPeriode: true,
            innvilgelsesperioder,
            harBarnetillegg: barnetilleggPerioder.length > 0,
            barnetilleggPerioder,
        },
        vedtaksperiode: {
            skalOmgjøreHeleVedtaket: true,
            periode: null,
        },
    };
};
