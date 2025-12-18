import { Søknadsbehandling, SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';
import { hentLagredePerioderMedBarn } from '~/components/behandling/felles/barnetillegg/utils/hentBarnetilleggFraBehandling';
import {
    SøknadsbehandlingAvslagState,
    SøknadsbehandlingIkkeValgtState,
    SøknadsbehandlingInnvilgelseState,
    SøknadsbehandlingState,
} from '~/components/behandling/context/søknadsbehandling/søknadsbehandlingSkjemaContext';
import { ANTALL_DAGER_DEFAULT } from '~/components/behandling/felles/dager-per-meldeperiode/BehandlingDagerPerMeldeperiode';

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
    const { resultat, vedtaksperiode } = behandling;

    // Hvis den lagrede behandling ikke er en innvilgelse (dvs saksbehandler har endret resultat),
    // så returnerer vi en blank innvilgelse uten perioder. Saksbehandler må velge innvilgelsesperioden
    if (!vedtaksperiode || resultat !== SøknadsbehandlingResultat.INNVILGELSE) {
        return {
            resultat: SøknadsbehandlingResultat.INNVILGELSE,
            innvilgelse: {
                harValgtPeriode: false,
                innvilgelsesperioder: [
                    {
                        periode: {},
                        antallDagerPerMeldeperiode: ANTALL_DAGER_DEFAULT,
                        tiltaksdeltakelseId: 'lol',
                    },
                ],
            },
        };
    }

    const barnetilleggPerioder = hentLagredePerioderMedBarn(behandling) ?? [];
    const harBarnetillegg = barnetilleggPerioder.length > 0;

    return {
        resultat: SøknadsbehandlingResultat.INNVILGELSE,
        innvilgelse: {
            harValgtPeriode: true,
            innvilgelsesperioder: [
                {
                    periode: vedtaksperiode,
                    antallDagerPerMeldeperiode: ANTALL_DAGER_DEFAULT,
                    tiltaksdeltakelseId: 'lol',
                },
            ],
            harBarnetillegg,
            barnetilleggPerioder,
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
