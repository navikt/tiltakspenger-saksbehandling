import { Søknadsbehandling, SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';
import { hentLagredePerioderMedBarn } from '~/components/behandling/felles/barnetillegg/utils/hentBarnetilleggFraBehandling';
import { ANTALL_DAGER_DEFAULT } from '~/components/behandling/felles/dager-per-meldeperiode/BehandlingDagerPerMeldeperiode';
import {
    SøknadsbehandlingAvslagState,
    SøknadsbehandlingIkkeValgtState,
    SøknadsbehandlingInnvilgelseState,
    SøknadsbehandlingState,
} from '~/components/behandling/context/søknadsbehandling/søknadsbehandlingSkjemaContext';

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
    const { resultat, virkningsperiode } = behandling;

    if (!virkningsperiode || resultat !== SøknadsbehandlingResultat.INNVILGELSE) {
        return {
            resultat: SøknadsbehandlingResultat.INNVILGELSE,
            innvilgelse: {
                harValgtPeriode: false,
                innvilgelsesperiode: {},
            },
        };
    }

    const barnetilleggPerioder = hentLagredePerioderMedBarn(behandling) ?? [];
    const harBarnetillegg = barnetilleggPerioder ? barnetilleggPerioder.length > 0 : false;

    return {
        resultat: SøknadsbehandlingResultat.INNVILGELSE,
        innvilgelse: {
            harValgtPeriode: true,
            innvilgelsesperiode: virkningsperiode,
            harBarnetillegg,
            barnetilleggPerioder,
            valgteTiltaksdeltakelser: behandling.valgteTiltaksdeltakelser,
            antallDagerPerMeldeperiode: behandling.antallDagerPerMeldeperiode
                ? behandling.antallDagerPerMeldeperiode
                : [
                      {
                          antallDagerPerMeldeperiode: ANTALL_DAGER_DEFAULT,
                          periode: virkningsperiode,
                      },
                  ],
        },
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
