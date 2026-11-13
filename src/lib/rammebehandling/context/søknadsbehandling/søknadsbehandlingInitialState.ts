import {
    Søknadsbehandling,
    SøknadsbehandlingResultat,
} from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { lagBarnetilleggSkjemaState } from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggSkjemaUtils';
import {
    SøknadsbehandlingAvslagState,
    SøknadsbehandlingIkkeValgtState,
    SøknadsbehandlingInnvilgelseState,
    SøknadsbehandlingState,
} from '~/lib/rammebehandling/context/søknadsbehandling/søknadsbehandlingSkjemaContext';

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
                    },
                ],
            },
        };
    }

    return {
        resultat: SøknadsbehandlingResultat.INNVILGELSE,
        innvilgelse: {
            harValgtPeriode: true,
            innvilgelsesperioder: behandling.innvilgelsesperioder,
            ...lagBarnetilleggSkjemaState(behandling, behandling.innvilgelsesperioder),
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
