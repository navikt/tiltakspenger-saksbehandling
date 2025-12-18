import { Periode } from '~/types/Periode';
import {
    erFullstendigPeriode,
    joinPerioder,
    periodiseringerErLike,
    utvidPeriodisering,
} from '~/utils/periode';
import { InnvilgelseState } from '~/components/behandling/context/innvilgelse/innvilgelseContext';
import { Reducer } from 'react';
import { Rammebehandling, Rammebehandlingstype } from '~/types/Rammebehandling';
import { SakProps } from '~/types/Sak';
import {
    hentForhåndsutfyltInnvilgelse,
    oppdaterPeriodiseringUtenOverlapp,
} from '~/components/behandling/context/behandlingSkjemaUtils';
import { hentVedtatteSøknadsbehandlinger } from '~/utils/sak';
import { periodiserBarnetilleggFraSøknad } from '~/components/behandling/felles/barnetillegg/utils/periodiserBarnetilleggFraSøknad';
import { Søknad } from '~/types/Søknad';
import { datoMax, datoMin } from '~/utils/date';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { Innvilgelsesperiode, InnvilgelsesperiodePartial } from '~/types/Innvilgelsesperiode';

export type InnvilgelsesperioderActions =
    | {
          type: 'oppdaterInnvilgelsesperiode';
          payload: {
              periode: Partial<Periode>;
              index: number;
              behandling: Rammebehandling;
              sak: SakProps;
          };
      }
    | {
          type: 'settAntallDager';
          payload: {
              antallDager: number;
              index: number;
          };
      }
    | {
          type: 'settTiltaksdeltakelse';
          payload: {
              tiltaksdeltakelseId: string;
              index: number;
          };
      }
    | {
          type: 'leggTilInnvilgelsesperiode';
          payload: {
              behandling: Rammebehandling;
              sak: SakProps;
          };
      }
    | {
          type: 'fjernInnvilgelsesperiode';
          payload: {
              index: number;
              behandling: Rammebehandling;
              sak: SakProps;
          };
      };

export const innvilgelsesperioderReducer: Reducer<InnvilgelseState, InnvilgelsesperioderActions> = (
    state,
    action,
) => {
    const { type, payload } = action;

    const { harValgtPeriode } = state;

    if (!harValgtPeriode) {
        if (type !== 'oppdaterInnvilgelsesperiode') {
            throw Error(
                'Første innvilgelsesperiode må fullstendig utfylt før andre deler handlinger kan utføres',
            );
        }

        const innvilgelsesperiode = state.innvilgelsesperioder.at(0)!;

        const { periode, behandling, sak } = payload;

        const nyPeriode = { ...innvilgelsesperiode.periode, ...periode };

        if (erFullstendigPeriode(nyPeriode)) {
            return hentForhåndsutfyltInnvilgelse(
                behandling,
                [{ ...innvilgelsesperiode, periode: nyPeriode }],
                sak,
            );
        }

        return {
            harValgtPeriode: false,
            innvilgelsesperioder: [innvilgelsesperiode],
        };
    }

    // const mestRelevanteSøknad =
    //     behandling.type === Rammebehandlingstype.SØKNADSBEHANDLING
    //         ? behandling.søknad
    //         : hentVedtatteSøknadsbehandlinger(sak).at(0)!.søknad;

    switch (type) {
        case 'oppdaterInnvilgelsesperiode': {
            const { periode, index } = payload;

            const innvilgelsesperiode = state.innvilgelsesperioder.at(index)!;

            const ny = {
                ...innvilgelsesperiode,
                periode: { ...innvilgelsesperiode.periode, ...periode },
            };

            return {
                ...state,
                innvilgelsesperioder: oppdaterPeriodiseringUtenOverlapp(
                    state.innvilgelsesperioder,
                    ny,
                    index,
                ),
                // barnetilleggPerioder: periodiserBarnetillegg(
                //     nyInnvilgelsesperiode,
                //     state.innvilgelsesperioder,
                //     state.barnetilleggPerioder,
                //     mestRelevanteSøknad,
                // ),
            };
        }
        case 'leggTilInnvilgelsesperiode': {
            const sisteInnvilgelsesperiode = state.innvilgelsesperioder.at(-1);
            if (!sisteInnvilgelsesperiode) {
                throw Error('Skal alltid finnes minst en innvilgelsesperiode');
            }

            const sistePeriode = sisteInnvilgelsesperiode.periode;

            const nyInnvilgelsesperiode = {
                ...sisteInnvilgelsesperiode,
                periode: { fraOgMed: sistePeriode.tilOgMed, tilOgMed: sistePeriode.tilOgMed },
            };

            return {
                ...state,
                innvilgelsesperioder: oppdaterPeriodiseringUtenOverlapp(
                    state.innvilgelsesperioder,
                    nyInnvilgelsesperiode,
                    state.innvilgelsesperioder.length,
                ),
            };
        }

        case 'fjernInnvilgelsesperiode': {
            const { index } = payload;

            return {
                ...state,
                innvilgelsesperioder: state.innvilgelsesperioder.toSpliced(index, 1),
            };
        }

        case 'settAntallDager': {
            const { index, antallDager } = payload;

            const innvilgelsesperioder = state.innvilgelsesperioder.at(index)!;

            return {
                ...state,
                innvilgelsesperioder: state.innvilgelsesperioder.with(index, {
                    ...innvilgelsesperioder,
                    antallDagerPerMeldeperiode: antallDager,
                }),
            };
        }

        case 'settTiltaksdeltakelse': {
            const { index, tiltaksdeltakelseId } = payload;

            const innvilgelsesperioder = state.innvilgelsesperioder.at(index)!;

            return {
                ...state,
                innvilgelsesperioder: state.innvilgelsesperioder.with(index, {
                    ...innvilgelsesperioder,
                    tiltaksdeltakelseId: tiltaksdeltakelseId,
                }),
            };
        }
    }
};

// Barnetillegg fyller ikke nødvendigvis hele innvilgelsesperioden, men vi forsøker å tilpasse for ny periode
// Vi har ikke alltid nok informasjon om barn til å gjøre dette perfekt, så det blir en en best-effort :|
const periodiserBarnetillegg = (
    nyPeriode: Periode,
    forrigePeriode: Periode,
    forrigeBarnetillegg: BarnetilleggPeriode[],
    søknad: Søknad,
) => {
    const barnetilleggFraSøknadForForrigePeriode = periodiserBarnetilleggFraSøknad(
        søknad.barnetillegg,
        forrigePeriode,
    );

    const harUendretPeriodisering = periodiseringerErLike(
        barnetilleggFraSøknadForForrigePeriode,
        forrigeBarnetillegg,
        (a, b) => a.antallBarn === b.antallBarn,
    );

    // Dersom periodiseringen fra søknaden er lik det saksbehandler hadde valgt, setter vi bare
    // en ny periodisering fra søknaden med den nye perioden.
    // Samme dersom saksbehandler ikke hadde valgt noen barnetilleggsperioder
    if (harUendretPeriodisering || forrigeBarnetillegg.length === 0) {
        return periodiserBarnetilleggFraSøknad(søknad.barnetillegg, nyPeriode);
    }

    const barnetilleggFraSøknad = periodiserBarnetilleggFraSøknad(
        søknad.barnetillegg,
        joinPerioder([nyPeriode, forrigePeriode]),
    );

    // Dersom det ikke finnes noen barn i søknaden for ny eller forrige periode, må vi anta at alle evt barn
    // har blitt lagt til manuelt av saksbehandler
    // Vi utvider bare eksisterende barnetillegg til ny periode
    if (barnetilleggFraSøknad.length === 0) {
        return utvidPeriodisering(forrigeBarnetillegg, nyPeriode);
    }

    const forrigeFraOgMed = forrigeBarnetillegg.at(0)!.periode.fraOgMed;
    const fraOgMedFraSøknad = barnetilleggFraSøknad.at(0)!.periode.fraOgMed;

    const forrigeTilOgMed = forrigeBarnetillegg.at(-1)!.periode.tilOgMed;
    const tilOgMedFraSøknad = barnetilleggFraSøknad.at(-1)!.periode.tilOgMed;

    // I alle andre tilfeller må saksbehandler ha gjort endringer ift den automatiske periodiseringen.
    // Vi oppdaterer den forrige periodiseringen med ny innvilgelsesperiode, men utvider ikke utenfor periodene vi får
    // fra søknaden, med mindre saksbehandler allerede hadde gjort nettopp det. Best-effort for å hindre at det innvilges
    // for barn <0 år eller >16 år
    return utvidPeriodisering(forrigeBarnetillegg, {
        fraOgMed:
            forrigeFraOgMed < fraOgMedFraSøknad
                ? nyPeriode.fraOgMed
                : datoMax(fraOgMedFraSøknad, nyPeriode.fraOgMed),
        tilOgMed:
            forrigeTilOgMed > tilOgMedFraSøknad
                ? nyPeriode.tilOgMed
                : datoMin(tilOgMedFraSøknad, nyPeriode.tilOgMed),
    });
};
