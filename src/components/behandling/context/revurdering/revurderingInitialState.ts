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
import { RammebehandlingMedInnvilgelse } from '~/types/Rammebehandling';
import { Periode } from '~/types/Periode';
import { TiltaksdeltakelsePeriode } from '~/types/TiltakDeltagelseTypes';
import {
    antallDagerPerMeldeperiodeForPeriode,
    tiltaksdeltagelserFraSaksopplysningerForPeriode,
} from '~/components/behandling/context/behandlingSkjemaUtils';

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
        fraDato: behandling.virkningsperiode?.fraOgMed,
        hjemlerForStans: behandling.valgtHjemmelHarIkkeRettighet ?? [],
        harValgtStansFraFørsteDagSomGirRett:
            behandling.harValgtStansFraFørsteDagSomGirRett ?? false,
    };
};

const innvilgelseInitialState = (
    behandling: RevurderingInnvilgelse,
    sak: SakProps,
): RevurderingInnvilgelseState => {
    const { virkningsperiode } = behandling;

    if (!virkningsperiode) {
        return {
            resultat: RevurderingResultat.INNVILGELSE,
            innvilgelse: {
                harValgtPeriode: false,
                innvilgelsesperiode: {},
            },
        };
    }

    const barnetilleggPerioder = hentBarnetilleggForRevurdering(behandling, virkningsperiode, sak);

    return {
        resultat: RevurderingResultat.INNVILGELSE,
        innvilgelse: {
            harValgtPeriode: true,
            innvilgelsesperiode: virkningsperiode,
            harBarnetillegg: barnetilleggPerioder.length > 0,
            barnetilleggPerioder,
            valgteTiltaksdeltakelser: valgteTiltaksdeltakelserInitialState(
                behandling,
                virkningsperiode,
            ),
            antallDagerPerMeldeperiode: behandling.antallDagerPerMeldeperiode ?? [
                {
                    antallDagerPerMeldeperiode: antallDagerPerMeldeperiodeForPeriode(
                        behandling,
                        virkningsperiode,
                    ),
                    periode: virkningsperiode,
                },
            ],
        },
    };
};

/*
 * Ved en omgjøring så skal all informasjon i behandlingen allerede være utfyllt fra før av.
 */
const omgjøringInitialState = (
    behandling: RevurderingOmgjøring,
    sak: SakProps,
): RevurderingOmgjøringState => {
    const { innvilgelsesperiode } = behandling;

    const barnetilleggPerioder = hentBarnetilleggForRevurdering(
        behandling,
        innvilgelsesperiode,
        sak,
    );

    return {
        resultat: RevurderingResultat.OMGJØRING,
        innvilgelse: {
            harValgtPeriode: true,
            innvilgelsesperiode: innvilgelsesperiode,
            harBarnetillegg: barnetilleggPerioder.length > 0,
            barnetilleggPerioder,
            valgteTiltaksdeltakelser: valgteTiltaksdeltakelserInitialState(
                behandling,
                innvilgelsesperiode,
            ),
            antallDagerPerMeldeperiode: behandling.antallDagerPerMeldeperiode,
        },
    };
};

const valgteTiltaksdeltakelserInitialState = (
    behandling: RammebehandlingMedInnvilgelse,
    innvilgelsesperiode: Periode,
): TiltaksdeltakelsePeriode[] => {
    return (
        behandling.valgteTiltaksdeltakelser ??
        tiltaksdeltagelserFraSaksopplysningerForPeriode(behandling, innvilgelsesperiode)
    );
};
