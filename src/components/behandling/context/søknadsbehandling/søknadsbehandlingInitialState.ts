import { Søknadsbehandling, SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';
import { hentBarnetilleggForSøknadsbehandling } from '~/components/behandling/felles/barnetillegg/utils/hentBarnetilleggFraBehandling';
import { ANTALL_DAGER_DEFAULT } from '~/components/behandling/felles/dager-per-meldeperiode/BehandlingDagerPerMeldeperiode';
import {
    SøknadsbehandlingAvslagState,
    SøknadsbehandlingIkkeValgtState,
    SøknadsbehandlingInnvilgelseState,
    SøknadsbehandlingState,
} from '~/components/behandling/context/søknadsbehandling/søknadsbehandlingSkjemaContext';
import { TiltaksdeltakelsePeriodeFormData } from '~/components/behandling/context/innvilgelse/slices/tiltaksdeltagelseContext';
import { hentTiltaksdeltagelseFraSøknad, hentTiltaksperiodeFraSøknad } from '~/utils/behandling';

export const søknadsbehandlingInitialState = (
    behandling: Søknadsbehandling,
    // Kan sette resultat separat fra det som er lagret på behandlingen, ettersom vi må
    // kunne sette initial state for nytt resultat når saksbehandler endrer resultatet
    resultat: SøknadsbehandlingResultat = behandling.resultat,
): SøknadsbehandlingState => {
    switch (resultat) {
        case SøknadsbehandlingResultat.IKKE_VALGT: {
            return {
                resultat: SøknadsbehandlingResultat.IKKE_VALGT,
            } satisfies SøknadsbehandlingIkkeValgtState;
        }

        case SøknadsbehandlingResultat.AVSLAG: {
            return avslagInitialState(behandling);
        }

        case SøknadsbehandlingResultat.INNVILGELSE: {
            return innvilgelseInitialState(behandling);
        }
    }
};

const innvilgelseInitialState = (
    behandling: Søknadsbehandling,
): SøknadsbehandlingInnvilgelseState => {
    const { resultat, virkningsperiode, saksopplysninger } = behandling;

    // Det skal ikke være mulig å velge innvilgelse dersom det ikke finnes en saksopplysningsperiode/tiltaksperiode
    const innvilgelsesperiode = virkningsperiode ?? saksopplysninger.periode!;

    const barnetilleggPerioder = hentBarnetilleggForSøknadsbehandling(behandling);

    const harBarnetillegg = barnetilleggPerioder.length > 0;

    return resultat === SøknadsbehandlingResultat.INNVILGELSE
        ? {
              resultat: SøknadsbehandlingResultat.INNVILGELSE,
              innvilgelsesperiode: innvilgelsesperiode,
              harBarnetillegg,
              barnetilleggPerioder,
              valgteTiltaksdeltakelser: behandling.valgteTiltaksdeltakelser,
              antallDagerPerMeldeperiode: behandling.antallDagerPerMeldeperiode
                  ? behandling.antallDagerPerMeldeperiode
                  : [
                        {
                            antallDagerPerMeldeperiode: ANTALL_DAGER_DEFAULT,
                            periode: innvilgelsesperiode,
                        },
                    ],
          }
        : {
              resultat: SøknadsbehandlingResultat.INNVILGELSE,
              innvilgelsesperiode: innvilgelsesperiode,
              harBarnetillegg,
              barnetilleggPerioder,
              valgteTiltaksdeltakelser: valgteTiltaksdeltakelserInitialState(behandling),
              antallDagerPerMeldeperiode: [
                  {
                      antallDagerPerMeldeperiode: ANTALL_DAGER_DEFAULT,
                      periode: innvilgelsesperiode,
                  },
              ],
          };
};

const avslagInitialState = (behandling: Søknadsbehandling): SøknadsbehandlingAvslagState => {
    return {
        resultat: SøknadsbehandlingResultat.AVSLAG,
        avslagsgrunner:
            behandling.resultat === SøknadsbehandlingResultat.AVSLAG
                ? behandling.avslagsgrunner
                : [],
    };
};

const valgteTiltaksdeltakelserInitialState = (
    behandling: Søknadsbehandling,
): TiltaksdeltakelsePeriodeFormData[] => {
    const tiltakFraSøknad = hentTiltaksdeltagelseFraSøknad(behandling);
    const innvilgelsesperiode =
        behandling.virkningsperiode ?? hentTiltaksperiodeFraSøknad(behandling);

    return tiltakFraSøknad
        ? [
              {
                  eksternDeltagelseId: tiltakFraSøknad.eksternDeltagelseId,
                  periode: {
                      fraOgMed: innvilgelsesperiode?.fraOgMed ?? null,
                      tilOgMed: innvilgelsesperiode?.tilOgMed ?? null,
                  },
              },
          ]
        : [];
};
