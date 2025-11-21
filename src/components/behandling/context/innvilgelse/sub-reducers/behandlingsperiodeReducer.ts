import { Periode } from '~/types/Periode';
import { perioderOverlapper } from '~/utils/periode';
import { datoMax, datoMin } from '~/utils/date';
import { BehandlingInnvilgelseState } from '~/components/behandling/context/innvilgelse/behandlingInnvilgelseContext';
import { Reducer } from 'react';

export type BehandlingsperiodeActions = {
    type: 'oppdaterBehandlingsperiode';
    payload: { periode: Partial<Periode> };
};

export const behandlingsperiodeReducer = (<State extends BehandlingInnvilgelseState>(
    state: State,
    action: BehandlingsperiodeActions,
) => {
    const { type, payload } = action;

    switch (type) {
        case 'oppdaterBehandlingsperiode': {
            const nyBehandlingsperiode = { ...state.behandlingsperiode, ...payload.periode };

            return {
                ...state,
                behandlingsperiode: nyBehandlingsperiode,
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
                          nyBehandlingsperiode as Periode,
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
                          nyBehandlingsperiode as Periode,
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
                          nyBehandlingsperiode as Periode,
                          false,
                      )
                    : state.barnetilleggPerioder,
            };
        }
    }
}) satisfies Reducer<BehandlingInnvilgelseState, BehandlingsperiodeActions>;

type MedPeriode = {
    periode: Periode;
};

// Denne må kanskje tweakes litt hvis vi får periodiserte innvilgelser i en behandling
const oppdaterPeriodisering = <T extends MedPeriode>(
    periodisering: T[],
    behandlingsperiode: Periode,
    // Tiltaksdeltagelse og antall dager per meldeperiode skal alltid fylle hele behandlingsperioden ved innvilgelse,
    // men barnetillegg kan omfatte kun deler av innvilgelsesperioden. Vi gjør en best-effort for å tilpasse for dette.
    skalAlltidFylleBehandlingsperioden: boolean,
): T[] => {
    const perioderInnenforBehandlingsperioden = periodisering.filter((p) =>
        perioderOverlapper(behandlingsperiode, p.periode),
    );

    if (perioderInnenforBehandlingsperioden.length === 0) {
        return [];
    }

    const førstePeriode = perioderInnenforBehandlingsperioden.at(0)!;

    if (perioderInnenforBehandlingsperioden.length === 1) {
        return perioderInnenforBehandlingsperioden.with(0, {
            ...førstePeriode,
            periode: skalAlltidFylleBehandlingsperioden
                ? behandlingsperiode
                : {
                      fraOgMed: datoMax(
                          behandlingsperiode.fraOgMed,
                          førstePeriode.periode.fraOgMed,
                      ),
                      tilOgMed: datoMin(
                          behandlingsperiode.tilOgMed,
                          førstePeriode.periode.tilOgMed,
                      ),
                  },
        });
    }

    const sistePeriode = perioderInnenforBehandlingsperioden.at(-1)!;

    return perioderInnenforBehandlingsperioden
        .with(0, {
            ...førstePeriode,
            periode: {
                fraOgMed: skalAlltidFylleBehandlingsperioden
                    ? behandlingsperiode.fraOgMed
                    : datoMax(behandlingsperiode.fraOgMed, førstePeriode.periode.fraOgMed),
                tilOgMed: førstePeriode.periode.tilOgMed,
            },
        })
        .with(-1, {
            ...sistePeriode,
            periode: {
                fraOgMed: sistePeriode.periode.fraOgMed,
                tilOgMed: skalAlltidFylleBehandlingsperioden
                    ? behandlingsperiode.tilOgMed
                    : datoMin(behandlingsperiode.tilOgMed, sistePeriode.periode.tilOgMed),
            },
        });
};
