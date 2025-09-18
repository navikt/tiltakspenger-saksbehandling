import {
    BehandlingData,
    Behandlingstype,
    RevurderingData,
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
    return behandling.type === Behandlingstype.SØKNADSBEHANDLING
        ? søknadsbehandlingInitialState(behandling)
        : revurderingInitialState(behandling, sak);
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
        avslagsgrunner:
            behandling.type === Behandlingstype.SØKNADSBEHANDLING
                ? behandling.avslagsgrunner
                : null,
        hjemlerForStans: null,
    };
};

const revurderingInitialState = (
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
        resultat: null,
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
        avslagsgrunner: null,
        hjemlerForStans: null,
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
