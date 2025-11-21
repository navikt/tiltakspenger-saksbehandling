import { Periode } from '~/types/Periode';
import { perioderOverlapper } from '~/utils/periode';
import { datoMax, datoMin } from '~/utils/date';
import { BehandlingInnvilgelseState } from '~/components/behandling/context/innvilgelse/behandlingInnvilgelseContext';
import { Reducer } from 'react';

export type InnvilgelsesperiodeAction = {
    type: 'oppdaterInnvilgelsesperiode';
    payload: { periode: Partial<Periode> };
};

export const innvilgelsesperiodeReducer = (<State extends BehandlingInnvilgelseState>(
    state: State,
    action: InnvilgelsesperiodeAction,
) => {
    const { type, payload } = action;

    switch (type) {
        case 'oppdaterInnvilgelsesperiode': {
            const nyInnvilgelsesperiode = { ...state.innvilgelsesperiode, ...payload.periode };

            return {
                ...state,
                innvilgelsesperiode: nyInnvilgelsesperiode,
                /*
                    Pga papirsøknad kan vi ikke garantere at periodene har fraOgMed og tilOgMed satt
                    går for en enkel fiks der vi bare sjekker om alle periodene har fraOgMed og tilOgMed satt før vi oppdaterer periodiseringen
                    */
                valgteTiltaksdeltakelser: state.valgteTiltaksdeltakelser.every(
                    (tpd) => tpd.periode.fraOgMed !== null && tpd.periode.tilOgMed !== null,
                )
                    ? oppdaterPeriodisering(
                          state.valgteTiltaksdeltakelser.map((tpd) => ({
                              ...tpd,
                              periode: {
                                  fraOgMed: tpd.periode.fraOgMed!,
                                  tilOgMed: tpd.periode.tilOgMed!,
                              },
                          })),
                          //den forstår ikke at peridoen er garantert pga if'en
                          nyInnvilgelsesperiode as Periode,
                          true,
                      )
                    : state.valgteTiltaksdeltakelser,

                /*
                    Pga papirsøknad kan vi ikke garantere at periodene har fraOgMed og tilOgMed satt
                    går for en enkel fiks der vi bare sjekker om alle periodene har fraOgMed og tilOgMed satt før vi oppdaterer periodiseringen
                    */
                antallDagerPerMeldeperiode: state.antallDagerPerMeldeperiode.every(
                    (adp) => adp.periode.fraOgMed !== null && adp.periode.tilOgMed !== null,
                )
                    ? oppdaterPeriodisering(
                          state.antallDagerPerMeldeperiode.map((adp) => ({
                              ...adp,
                              periode: {
                                  fraOgMed: adp.periode.fraOgMed!,
                                  tilOgMed: adp.periode.tilOgMed!,
                              },
                          })),
                          //den forstår ikke at peridoen er garantert pga if'en
                          nyInnvilgelsesperiode as Periode,
                          true,
                      )
                    : state.antallDagerPerMeldeperiode,
                /*
                    Pga papirsøknad kan vi ikke garantere at periodene har fraOgMed og tilOgMed satt
                    går for en enkel fiks der vi bare sjekker om alle periodene har fraOgMed og tilOgMed satt før vi oppdaterer periodiseringen
                    */
                barnetilleggPerioder: state.barnetilleggPerioder.every(
                    (bp) => bp.periode.fraOgMed !== null && bp.periode.tilOgMed !== null,
                )
                    ? oppdaterPeriodisering(
                          state.barnetilleggPerioder.map((bp) => ({
                              ...bp,
                              periode: {
                                  fraOgMed: bp.periode.fraOgMed!,
                                  tilOgMed: bp.periode.tilOgMed!,
                              },
                          })),
                          //den forstår ikke at peridoen er garantert pga if'en
                          nyInnvilgelsesperiode as Periode,
                          false,
                      )
                    : state.barnetilleggPerioder,
            };
        }
    }
}) satisfies Reducer<BehandlingInnvilgelseState, InnvilgelsesperiodeAction>;

type MedPeriode = {
    periode: Periode;
};

// Denne må kanskje tweakes litt hvis vi får periodiserte innvilgelser i en behandling
const oppdaterPeriodisering = <T extends MedPeriode>(
    periodisering: T[],
    innvilgelsesperiode: Periode,
    // Tiltaksdeltagelse og antall dager per meldeperiode skal alltid fylle hele innvilgelsesperioden ved innvilgelse,
    // men barnetillegg kan omfatte kun deler av innvilgelsesperioden. Vi gjør en best-effort for å tilpasse for dette.
    skalAlltidFylleInnvilgelsesperioden: boolean,
): T[] => {
    const perioderInnenforInnvilgelsesperioden = periodisering.filter((p) =>
        perioderOverlapper(innvilgelsesperiode, p.periode),
    );

    if (perioderInnenforInnvilgelsesperioden.length === 0) {
        return [];
    }

    const førstePeriode = perioderInnenforInnvilgelsesperioden.at(0)!;

    if (perioderInnenforInnvilgelsesperioden.length === 1) {
        return perioderInnenforInnvilgelsesperioden.with(0, {
            ...førstePeriode,
            periode: skalAlltidFylleInnvilgelsesperioden
                ? innvilgelsesperiode
                : {
                      fraOgMed: datoMax(
                          innvilgelsesperiode.fraOgMed,
                          førstePeriode.periode.fraOgMed,
                      ),
                      tilOgMed: datoMin(
                          innvilgelsesperiode.tilOgMed,
                          førstePeriode.periode.tilOgMed,
                      ),
                  },
        });
    }

    const sistePeriode = perioderInnenforInnvilgelsesperioden.at(-1)!;

    return perioderInnenforInnvilgelsesperioden
        .with(0, {
            ...førstePeriode,
            periode: {
                fraOgMed: skalAlltidFylleInnvilgelsesperioden
                    ? innvilgelsesperiode.fraOgMed
                    : datoMax(innvilgelsesperiode.fraOgMed, førstePeriode.periode.fraOgMed),
                tilOgMed: førstePeriode.periode.tilOgMed,
            },
        })
        .with(-1, {
            ...sistePeriode,
            periode: {
                fraOgMed: sistePeriode.periode.fraOgMed,
                tilOgMed: skalAlltidFylleInnvilgelsesperioden
                    ? innvilgelsesperiode.tilOgMed
                    : datoMin(innvilgelsesperiode.tilOgMed, sistePeriode.periode.tilOgMed),
            },
        });
};
