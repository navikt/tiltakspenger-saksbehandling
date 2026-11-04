import { Dato } from '~/types/DatoTid';
import { Reducer } from 'react';
import {
    RevurderingForlengelse,
    RevurderingResultat,
} from '~/lib/rammebehandling/typer/Revurdering';
import { ReducerSuperAction } from '~/types/ReducerAction';
import {
    InnvilgelseActions,
    innvilgelseReducer,
    InnvilgelseState,
} from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import {
    BehandlingSkjemaContextBase,
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/lib/rammebehandling/context/BehandlingSkjemaContext';
import {
    antallDagerPerMeldeperiodeForPeriode,
    BehandlingSkjemaType,
} from '~/lib/rammebehandling/context/behandlingSkjemaUtils';
import { SakProps } from '~/lib/sak/SakTyper';
import { Innvilgelsesperiode } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import { hentRammevedtak } from '~/lib/sak/sakUtils';
import { hentLagredePerioderMedBarn } from '~/lib/rammebehandling/felles/barnetillegg/utils/hentBarnetilleggFraBehandling';
import { utvidPeriodisering } from '~/utils/periode';
import { Periode } from '~/types/Periode';
import { useRevurderingBehandling } from '~/lib/rammebehandling/context/BehandlingContext';

// Innvilgelsen holdes synkron med valgt til og med-dato og tiltaksdeltakelse, slik at felles komponenter for barnetillegg,
// validering og forhåndsvisning kan gjenbrukes. Backend utleder selv innvilgelsesperioden fra disse.
// Inntil begge er valgt, ligger valgene i den ufullstendige innvilgelsesperioden.
export type RevurderingForlengelseState = {
    resultat: RevurderingResultat.FORLENGELSE;
    forlengesFraOgMed: Dato;
    // Om saksbehandler har valgt barnetillegget selv.
    // Ellers utleder og lagrer backend barnetillegget fra vedtaket som forlenges hver gang behandlingen lagres.
    harEndretBarnetillegg: boolean;
    innvilgelse: InnvilgelseState;
};

type ForlengelseActions =
    | {
          type: 'settForlengelseTilOgMed';
          payload: {
              tilOgMed: Dato;
              behandling: RevurderingForlengelse;
              sak: SakProps;
          };
      }
    | {
          type: 'settForlengelseTiltaksdeltakelse';
          payload: {
              internDeltakelseId: string;
              behandling: RevurderingForlengelse;
              sak: SakProps;
          };
      }
    | {
          type: 'settHarValgtBarnetillegg';
          payload: {
              harEndretBarnetillegg: boolean;
              behandling: RevurderingForlengelse;
          };
      };

export type RevurderingForlengelseActions = ReducerSuperAction<
    ForlengelseActions | InnvilgelseActions,
    BehandlingSkjemaType.RevurderingForlengelse
>;

export const revurderingForlengelseReducer: Reducer<
    RevurderingForlengelseState,
    RevurderingForlengelseActions
> = (state, action) => {
    switch (action.type) {
        case 'settForlengelseTilOgMed': {
            const { tilOgMed, behandling, sak } = action.payload;

            return medInnvilgelsesperiode(
                state,
                { tilOgMed, internDeltakelseId: hentForlengelseTiltaksdeltakelse(state) },
                behandling,
                sak,
            );
        }

        case 'settForlengelseTiltaksdeltakelse': {
            const { internDeltakelseId, behandling, sak } = action.payload;

            return medInnvilgelsesperiode(
                state,
                { tilOgMed: hentForlengelseTilOgMed(state), internDeltakelseId },
                behandling,
                sak,
            );
        }

        case 'settHarValgtBarnetillegg': {
            const { harEndretBarnetillegg, behandling } = action.payload;
            const { innvilgelse } = state;

            if (harEndretBarnetillegg || !innvilgelse.harValgtPeriode) {
                return { ...state, harEndretBarnetillegg };
            }

            const barnetilleggPerioder = utvidPeriodisering(
                hentLagredePerioderMedBarn(behandling) ?? [],
                innvilgelse.innvilgelsesperioder.atNonNull(0).periode,
            );

            return {
                ...state,
                harEndretBarnetillegg,
                innvilgelse: {
                    ...innvilgelse,
                    harBarnetillegg: barnetilleggPerioder.length > 0,
                    barnetilleggPerioder,
                },
            };
        }

        case 'setHarSøktBarnetillegg':
        case 'addBarnetilleggPeriode':
        case 'fjernBarnetilleggPeriode':
        case 'oppdaterBarnetilleggAntall':
        case 'oppdaterBarnetilleggPeriode':
        case 'settBarnetilleggPerioder': {
            return {
                ...state,
                harEndretBarnetillegg: true,
                innvilgelse: innvilgelseReducer(state.innvilgelse, action),
            };
        }

        case 'oppdaterInnvilgelsesperiode':
        case 'leggTilInnvilgelsesperiode':
        case 'fjernInnvilgelsesperiode':
        case 'settAntallDager':
        case 'settTiltaksdeltakelse': {
            throw Error(`Innvilgelsesperioden kan ikke endres direkte ved forlengelse`);
        }
    }

    throw Error(`Ugyldig action for forlengelse: ${action satisfies never}`);
};

export const forlengelseInitialState = (
    behandling: RevurderingForlengelse,
): RevurderingForlengelseState => {
    const { innvilgelsesperioder, forlengesFraOgMed, harEndretBarnetillegg } = behandling;

    if (!innvilgelsesperioder) {
        const { tiltaksdeltakelserSomKanForlenges } = behandling;

        return {
            resultat: RevurderingResultat.FORLENGELSE,
            forlengesFraOgMed,
            harEndretBarnetillegg,
            innvilgelse: {
                harValgtPeriode: false,
                innvilgelsesperioder: [
                    {
                        periode: { fraOgMed: forlengesFraOgMed },
                        // Saksbehandler må velge selv når vedtaket kan forlenges for flere tiltak.
                        internDeltakelseId:
                            tiltaksdeltakelserSomKanForlenges.length === 1
                                ? tiltaksdeltakelserSomKanForlenges[0]
                                : undefined,
                    },
                ],
            },
        };
    }

    // Det lagrede barnetillegget er enten valgt av saksbehandler eller utledet av backend.
    const barnetilleggPerioder = hentLagredePerioderMedBarn(behandling) ?? [];

    return {
        resultat: RevurderingResultat.FORLENGELSE,
        forlengesFraOgMed,
        harEndretBarnetillegg,
        innvilgelse: {
            harValgtPeriode: true,
            innvilgelsesperioder,
            harBarnetillegg: barnetilleggPerioder.length > 0,
            barnetilleggPerioder,
        },
    };
};

export const hentForlengelseTilOgMed = (state: RevurderingForlengelseState): Dato | undefined =>
    state.innvilgelse.innvilgelsesperioder.at(-1)?.periode.tilOgMed;

export const hentForlengelseTiltaksdeltakelse = (
    state: RevurderingForlengelseState,
): string | undefined => state.innvilgelse.innvilgelsesperioder.at(-1)?.internDeltakelseId;

// Det lagrede barnetillegget gjelder bare så lenge verken til og med-datoen eller tiltaksdeltakelsen er endret siden behandlingen ble lagret.
export const erLagretMedSammePeriodeOgTiltak = (
    state: RevurderingForlengelseState,
    behandling: RevurderingForlengelse,
): boolean => {
    const tilOgMed = hentForlengelseTilOgMed(state);
    const lagret = behandling.innvilgelsesperioder?.at(-1);
    return (
        tilOgMed !== undefined &&
        tilOgMed === lagret?.periode.tilOgMed &&
        hentForlengelseTiltaksdeltakelse(state) === lagret.internDeltakelseId
    );
};

const medInnvilgelsesperiode = (
    state: RevurderingForlengelseState,
    valgt: { tilOgMed?: Dato; internDeltakelseId?: string },
    behandling: RevurderingForlengelse,
    sak: SakProps,
): RevurderingForlengelseState => {
    const { tilOgMed, internDeltakelseId } = valgt;

    if (!tilOgMed || !internDeltakelseId) {
        return {
            ...state,
            innvilgelse: {
                harValgtPeriode: false,
                innvilgelsesperioder: [
                    {
                        periode: { fraOgMed: state.forlengesFraOgMed, tilOgMed },
                        internDeltakelseId,
                    },
                ],
            },
        };
    }

    const periode: Periode = { fraOgMed: state.forlengesFraOgMed, tilOgMed };
    const forrige = state.innvilgelse;

    // Uten valgt barnetillegg er dette det sist lagrede fra backend, som saksbehandler kan endre med utgangspunkt i.
    const barnetilleggPerioder = forrige.harValgtPeriode
        ? utvidPeriodisering(forrige.barnetilleggPerioder, periode)
        : [];

    return {
        ...state,
        innvilgelse: {
            harValgtPeriode: true,
            innvilgelsesperioder: [
                {
                    periode,
                    antallDagerPerMeldeperiode: hentAntallDagerPerMeldeperiode(
                        periode,
                        internDeltakelseId,
                        behandling,
                        sak,
                    ),
                    internDeltakelseId,
                },
            ],
            harBarnetillegg: barnetilleggPerioder.length > 0,
            barnetilleggPerioder,
        },
    };
};

// Antall dager videreføres fra den siste perioden vedtaket som forlenges innvilget for tiltaksdeltakelsen, slik backend gjør.
const hentAntallDagerPerMeldeperiode = (
    periode: Periode,
    internDeltakelseId: string,
    behandling: RevurderingForlengelse,
    sak: SakProps,
): number => {
    const erValgtTiltak = (innvilgelsesperiode: Innvilgelsesperiode) =>
        innvilgelsesperiode.internDeltakelseId === internDeltakelseId;

    const mal =
        hentRammevedtak(sak, behandling.forlengerRammevedtakId)
            .innvilgelsesperioder?.filter(erValgtTiltak)
            .at(-1) ?? behandling.innvilgelsesperioder?.filter(erValgtTiltak).at(-1);

    return (
        mal?.antallDagerPerMeldeperiode ?? antallDagerPerMeldeperiodeForPeriode(behandling, periode)
    );
};

export type RevurderingForlengelseContext =
    BehandlingSkjemaContextBase<RevurderingForlengelseState>;

export const useRevurderingForlengelseSkjema = (): RevurderingForlengelseContext => {
    const context = useBehandlingSkjema();

    if (context.resultat !== RevurderingResultat.FORLENGELSE) {
        throw Error(`Feil resultat for forlengelse context: ${context.resultat}`);
    }

    return context;
};

export const useRevurderingForlengelseSkjemaDispatch = () => {
    const dispatch = useBehandlingSkjemaDispatch();

    return (action: ForlengelseActions | InnvilgelseActions) =>
        dispatch({ ...action, superType: BehandlingSkjemaType.RevurderingForlengelse });
};

export const useForlengelseBehandling = (): RevurderingForlengelse => {
    const { behandling } = useRevurderingBehandling();

    if (behandling.resultat !== RevurderingResultat.FORLENGELSE) {
        throw Error(`Behandlingen er ikke en forlengelse: ${behandling.resultat}`);
    }

    return behandling;
};
