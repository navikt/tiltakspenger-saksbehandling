import {
    hentHeleTiltaksdeltagelsesperioden,
    hentTiltaksdeltagelseFraSøknad,
    hentTiltaksdeltakelserMedStartOgSluttdato,
    hentTiltaksperiodeFraSøknad,
} from '~/utils/behandling';
import {
    hentBarnetilleggForRevurdering,
    hentBarnetilleggForSøknadsbehandling,
} from '~/components/behandling/felles/barnetillegg/utils/hentBarnetilleggFraBehandling';
import { BehandlingSkjemaState } from '~/components/behandling/context/BehandlingSkjemaReducer';
import { Periode } from '~/types/Periode';
import { SakProps } from '~/types/Sak';

import { erDatoIPeriode } from '~/utils/periode';
import { ANTALL_DAGER_DEFAULT } from '~/components/behandling/felles/dager-per-meldeperiode/BehandlingDagerPerMeldeperiode';
import { Rammebehandling, BehandlingResultat, Behandlingstype } from '~/types/Behandling';
import { TiltaksdeltakelsePeriodeFormData } from './slices/TiltaksdeltagelseState';
import { Nullable } from '~/types/UtilTypes';
import {
    TiltaksdeltagelseMedPeriode,
    TiltaksdeltakelsePeriode,
} from '~/types/TiltakDeltagelseTypes';

import { Søknadsbehandling } from '~/types/Søknadsbehandling';
import {
    Revurdering,
    RevurderingInnvilgelse,
    RevurderingOmgjøring,
    RevurderingStans,
} from '~/types/Revurdering';

export const behandlingSkjemaInitialValue = ({
    behandling,
    sak,
}: {
    behandling: Rammebehandling;
    sak: SakProps;
}): BehandlingSkjemaState => {
    const { type } = behandling;

    switch (type) {
        case Behandlingstype.SØKNADSBEHANDLING: {
            return søknadsbehandlingInitialState(behandling);
        }
        case Behandlingstype.REVURDERING: {
            return revurderingInitialState(behandling, sak);
        }
    }

    throw new Error(`Ukjent behandlingstype: ${type satisfies never}`);
};

const valgteTiltaksdeltakelserFraBehandlingTilFormData = (
    behandlingsperiode: Nullable<Periode>,
    valgteTiltaksdeltakelser: Nullable<TiltaksdeltakelsePeriode[]>,
    tiltakFraSøknad: Nullable<TiltaksdeltagelseMedPeriode>,
): TiltaksdeltakelsePeriodeFormData[] => {
    return (
        valgteTiltaksdeltakelser?.map((tiltaksdeltakelse) => ({
            eksternDeltagelseId: tiltaksdeltakelse.eksternDeltagelseId,
            periode: {
                fraOgMed: tiltaksdeltakelse.periode.fraOgMed,
                tilOgMed: tiltaksdeltakelse.periode.tilOgMed,
            },
        })) ||
        (tiltakFraSøknad && [
            {
                eksternDeltagelseId: tiltakFraSøknad.eksternDeltagelseId,
                periode: {
                    fraOgMed: behandlingsperiode?.fraOgMed ?? null,
                    tilOgMed: behandlingsperiode?.tilOgMed ?? null,
                },
            },
        ]) ||
        []
    );
};

const søknadsbehandlingInitialState = (behandling: Søknadsbehandling): BehandlingSkjemaState => {
    const tiltaksperiode = hentTiltaksperiodeFraSøknad(behandling);
    const tiltakFraSoknad = hentTiltaksdeltagelseFraSøknad(behandling);

    const barnetilleggPerioder = hentBarnetilleggForSøknadsbehandling(behandling);

    return {
        resultat: behandling.resultat,
        behandlingsperiode: behandling.virkningsperiode ?? tiltaksperiode,

        harBarnetillegg: barnetilleggPerioder.length > 0,
        barnetilleggPerioder,
        valgteTiltaksdeltakelser: valgteTiltaksdeltakelserFraBehandlingTilFormData(
            behandling.virkningsperiode ?? tiltaksperiode,
            behandling.valgteTiltaksdeltakelser,
            tiltakFraSoknad,
        ),
        antallDagerPerMeldeperiode: behandling.antallDagerPerMeldeperiode
            ? behandling.antallDagerPerMeldeperiode.map((dager) => ({
                  antallDagerPerMeldeperiode: dager.antallDagerPerMeldeperiode,
                  periode: {
                      fraOgMed: dager.periode.fraOgMed,
                      tilOgMed: dager.periode.tilOgMed,
                  },
              }))
            : [
                  {
                      antallDagerPerMeldeperiode: ANTALL_DAGER_DEFAULT,
                      periode: behandling.virkningsperiode
                          ? {
                                fraOgMed: behandling.virkningsperiode.fraOgMed,
                                tilOgMed: behandling.virkningsperiode.tilOgMed,
                            }
                          : tiltaksperiode?.fraOgMed && tiltaksperiode?.tilOgMed
                            ? {
                                  fraOgMed: tiltaksperiode.fraOgMed,
                                  tilOgMed: tiltaksperiode.tilOgMed,
                              }
                            : { fraOgMed: null, tilOgMed: null },
                  },
              ],
        avslagsgrunner: behandling.avslagsgrunner ?? [],

        // Ikke i bruk for denne behandlingstypen
        hjemlerForStans: [],
        //Kanskje disse burde vært Nullable<boolean> for søknadsbehandling. Må da skille stans-staten og søknadsbehandling staten (vi bruker felles behandling state)
        harValgtStansFraFørsteDagSomGirRett: false,
        harValgtStansTilSisteDagSomGirRett: false,
    };
};

const revurderingInitialState = (behandling: Revurdering, sak: SakProps): BehandlingSkjemaState => {
    const { resultat } = behandling;

    switch (resultat) {
        case BehandlingResultat.REVURDERING_INNVILGELSE: {
            return revurderingInnvilgelseInitialState(behandling, sak);
        }
        case BehandlingResultat.STANS: {
            return revurderingStansInitialState(behandling);
        }
        case BehandlingResultat.OMGJØRING: {
            return revurderingOmgjøringInitialState(behandling);
        }
    }

    throw new Error(`Ukjent revurdering resultat: ${resultat satisfies never}`);
};

const revurderingInnvilgelseInitialState = (
    behandling: RevurderingInnvilgelse,
    sak: SakProps,
): BehandlingSkjemaState => {
    const tiltaksperiode = hentHeleTiltaksdeltagelsesperioden(behandling);

    const behandlingsperiode = behandling.virkningsperiode ?? tiltaksperiode;

    const barnetilleggPerioder = hentBarnetilleggForRevurdering(
        behandlingsperiode,
        behandling,
        sak,
    );

    return {
        resultat: BehandlingResultat.REVURDERING_INNVILGELSE,
        behandlingsperiode,
        harBarnetillegg: barnetilleggPerioder.length > 0,
        barnetilleggPerioder,
        valgteTiltaksdeltakelser:
            behandling.valgteTiltaksdeltakelser ??
            tilValgteTiltaksdeltakelser(behandling, behandlingsperiode),
        antallDagerPerMeldeperiode: behandling.antallDagerPerMeldeperiode ?? [
            {
                antallDagerPerMeldeperiode: ANTALL_DAGER_DEFAULT,
                periode: {
                    fraOgMed: behandlingsperiode.fraOgMed,
                    tilOgMed: behandlingsperiode.tilOgMed,
                },
            },
        ],

        // Ikke i bruk for denne behandlingstypen
        avslagsgrunner: [],
        hjemlerForStans: [],

        //Kanskje disse burde vært Nullable<boolean> for revurdering innvilgelse - vi bruker felles behandling state
        harValgtStansFraFørsteDagSomGirRett: false,
        harValgtStansTilSisteDagSomGirRett: false,
    };
};

const revurderingStansInitialState = (behandling: RevurderingStans): BehandlingSkjemaState => {
    return {
        resultat: BehandlingResultat.STANS,
        behandlingsperiode: behandling.virkningsperiode ?? {},
        hjemlerForStans: behandling.valgtHjemmelHarIkkeRettighet ?? [],
        harValgtStansFraFørsteDagSomGirRett:
            behandling.harValgtStansFraFørsteDagSomGirRett ?? false,
        harValgtStansTilSisteDagSomGirRett: behandling.harValgtStansTilSisteDagSomGirRett ?? false,

        // Ikke i bruk for denne behandlingstypen
        harBarnetillegg: false,
        barnetilleggPerioder: [],
        valgteTiltaksdeltakelser: [],
        antallDagerPerMeldeperiode: [],
        avslagsgrunner: [],
    };
};

/*
 * Ved en omgjøring så skal all informasjon i behandlingen allerede være utfyllt fra før av.
 */
const revurderingOmgjøringInitialState = (
    behandling: RevurderingOmgjøring,
): BehandlingSkjemaState => {
    return {
        resultat: BehandlingResultat.OMGJØRING,
        behandlingsperiode: behandling.innvilgelsesperiode,
        harBarnetillegg: behandling.barnetillegg !== null,
        barnetilleggPerioder: behandling.barnetillegg!.perioder,
        valgteTiltaksdeltakelser: behandling.valgteTiltaksdeltakelser!,
        antallDagerPerMeldeperiode: behandling.antallDagerPerMeldeperiode!,

        // Ikke i bruk for denne behandlingstypen
        avslagsgrunner: [],
        hjemlerForStans: [],

        //Kanskje disse burde vært Nullable<boolean> for revurdering omgjøring - vi bruker felles behandling state
        harValgtStansFraFørsteDagSomGirRett: false,
        harValgtStansTilSisteDagSomGirRett: false,
    };
};

const tilValgteTiltaksdeltakelser = (
    behandling: Rammebehandling,
    behandlingsperiode: Periode,
): TiltaksdeltakelsePeriodeFormData[] => {
    const overlappendeDeltakelser: TiltaksdeltakelsePeriodeFormData[] = [];

    const tiltak = hentTiltaksdeltakelserMedStartOgSluttdato(behandling).map(
        (tiltaksdeltagelse) => ({
            eksternDeltagelseId: tiltaksdeltagelse.eksternDeltagelseId,
            periode: {
                fraOgMed: tiltaksdeltagelse.deltagelseFraOgMed,
                tilOgMed: tiltaksdeltagelse.deltagelseTilOgMed,
            },
        }),
    );

    // finner tiltaksdeltakelsene som overlapper med innvilgelsesperioden for at det skal bli riktig når man har flere tiltak, men bare et av dem gjelder valgt periode
    tiltak.forEach((tiltaksdeltagelse) => {
        if (
            erDatoIPeriode(behandlingsperiode.fraOgMed, tiltaksdeltagelse.periode) ||
            erDatoIPeriode(behandlingsperiode.tilOgMed, tiltaksdeltagelse.periode)
        ) {
            overlappendeDeltakelser.push(tiltaksdeltagelse);
        }
    });
    return overlappendeDeltakelser;
};
