import {
    BehandlingData,
    Behandlingstype,
    RevurderingData,
    RevurderingResultat,
    SøknadsbehandlingData,
} from '~/types/BehandlingTypes';
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
import { SakProps } from '~/types/SakTypes';
import { VedtakTiltaksdeltakelsePeriode } from '~/types/VedtakTyper';
import { erDatoIPeriode } from '~/utils/periode';

export const behandlingSkjemaInitialValue = ({
    behandling,
    sak,
}: {
    behandling: BehandlingData;
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

const søknadsbehandlingInitialState = (
    behandling: SøknadsbehandlingData,
): BehandlingSkjemaState => {
    const tiltaksperiode = hentTiltaksperiodeFraSøknad(behandling);
    const tiltakFraSoknad = hentTiltaksdeltagelseFraSøknad(behandling);

    const barnetilleggPerioder = hentBarnetilleggForSøknadsbehandling(behandling);

    return {
        resultat: behandling.resultat,
        behandlingsperiode: behandling.virkningsperiode ?? tiltaksperiode,
        harBarnetillegg: barnetilleggPerioder.length > 0,
        barnetilleggPerioder,
        valgteTiltaksdeltakelser:
            behandling.valgteTiltaksdeltakelser ||
            (tiltakFraSoknad && [
                {
                    eksternDeltagelseId: tiltakFraSoknad.eksternDeltagelseId,
                    periode: behandling.virkningsperiode ?? tiltaksperiode,
                },
            ]) ||
            [],
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
                      antallDagerPerMeldeperiode: 10,
                      periode: behandling.virkningsperiode
                          ? {
                                fraOgMed: behandling.virkningsperiode.fraOgMed,
                                tilOgMed: behandling.virkningsperiode.tilOgMed,
                            }
                          : {
                                fraOgMed: tiltaksperiode.fraOgMed,
                                tilOgMed: tiltaksperiode.tilOgMed,
                            },
                  },
              ],
        avslagsgrunner: behandling.avslagsgrunner ?? [],

        // Ikke i bruk for denne behandlingstypen
        hjemlerForStans: [],
    };
};

const revurderingInitialState = (
    behandling: RevurderingData,
    sak: SakProps,
): BehandlingSkjemaState => {
    const { resultat } = behandling;

    switch (resultat) {
        case RevurderingResultat.REVURDERING_INNVILGELSE: {
            return revurderingInnvilgelseInitialState(behandling, sak);
        }
        case RevurderingResultat.STANS: {
            return revurderingStansInitialState(behandling);
        }
    }

    throw new Error(`Ukjent revurdering resultat: ${resultat satisfies never}`);
};

const revurderingInnvilgelseInitialState = (
    behandling: RevurderingData,
    sak: SakProps,
): BehandlingSkjemaState => {
    const tiltaksperiode: Periode = hentHeleTiltaksdeltagelsesperioden(behandling);

    const behandlingsperiode = behandling.virkningsperiode ?? tiltaksperiode;

    const barnetilleggPerioder = hentBarnetilleggForRevurdering(
        behandlingsperiode,
        behandling,
        sak,
    );

    return {
        resultat: RevurderingResultat.REVURDERING_INNVILGELSE,
        behandlingsperiode,
        harBarnetillegg: barnetilleggPerioder.length > 0,
        barnetilleggPerioder,
        valgteTiltaksdeltakelser:
            behandling.valgteTiltaksdeltakelser ??
            tilValgteTiltaksdeltakelser(behandling, behandlingsperiode),
        antallDagerPerMeldeperiode: behandling.antallDagerPerMeldeperiode ?? [
            {
                antallDagerPerMeldeperiode: 10,
                periode: {
                    fraOgMed: behandlingsperiode.fraOgMed,
                    tilOgMed: behandlingsperiode.tilOgMed,
                },
            },
        ],

        // Ikke i bruk for denne behandlingstypen
        avslagsgrunner: [],
        hjemlerForStans: [],
    };
};

const revurderingStansInitialState = (behandling: RevurderingData): BehandlingSkjemaState => {
    return {
        resultat: RevurderingResultat.STANS,
        behandlingsperiode: behandling.virkningsperiode ?? {},
        hjemlerForStans: behandling.valgtHjemmelHarIkkeRettighet ?? [],

        // Ikke i bruk for denne behandlingstypen
        harBarnetillegg: false,
        barnetilleggPerioder: [],
        valgteTiltaksdeltakelser: [],
        antallDagerPerMeldeperiode: [],
        avslagsgrunner: [],
    };
};

const tilValgteTiltaksdeltakelser = (
    behandling: BehandlingData,
    behandlingsperiode: Periode,
): VedtakTiltaksdeltakelsePeriode[] => {
    const overlappendeDeltakelser: VedtakTiltaksdeltakelsePeriode[] = [];

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
