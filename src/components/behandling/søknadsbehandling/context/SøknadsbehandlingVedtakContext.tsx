import { SøknadsbehandlingData } from '~/types/BehandlingTypes';
import {
    createContext,
    Dispatch,
    PropsWithChildren,
    useCallback,
    useContext,
    useReducer,
    useRef,
} from 'react';
import { useSøknadsbehandling } from '../../BehandlingContext';
import {
    SøknadsbehandlingReducer,
    SøknadsbehandlingSkjemaActions,
    SøknadsbehandlingSkjemaState,
} from './SøknadsbehandlingReducer';
import {
    harSøktBarnetillegg,
    hentTiltaksdeltagelseFraSoknad,
    hentTiltaksperiodeFraSøknad,
} from '~/utils/behandling';
import { periodiserBarnetillegg } from '~/utils/BarnetilleggUtils';
import { TextAreaInput } from '~/utils/textarea';

type TextAreaInputs = {
    textAreas: {
        begrunnelse: TextAreaInput;
        brevtekst: TextAreaInput;
        barnetilleggBegrunnelse: TextAreaInput;
    };
};

export type SøknadsbehandlingVedtakContext = TextAreaInputs & SøknadsbehandlingSkjemaState;

// Separate contexts for å hindre re-renders for komponenter som kun bruker dispatch
const StateContext = createContext({} as SøknadsbehandlingVedtakContext);
const DispatchContext = createContext((() => ({})) as Dispatch<SøknadsbehandlingSkjemaActions>);

const initieltVedtakSkjema = (behandling: SøknadsbehandlingData): SøknadsbehandlingSkjemaState => {
    const tiltaksperiode = hentTiltaksperiodeFraSøknad(behandling);
    const tiltakFraSoknad = hentTiltaksdeltagelseFraSoknad(behandling);

    return {
        resultat: behandling.resultat,
        behandlingsperiode: behandling.virkningsperiode ?? tiltaksperiode,
        harBarnetillegg: harSøktBarnetillegg(behandling),
        barnetilleggPerioder:
            behandling.barnetillegg?.perioder ||
            periodiserBarnetillegg(
                behandling.søknad.barnetillegg,
                behandling.virkningsperiode ?? tiltaksperiode,
            ),
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
        avslagsgrunner: behandling.avslagsgrunner,
    };
};

export const SøknadsbehandlingVedtakProvider = ({ children }: PropsWithChildren) => {
    const { behandling } = useSøknadsbehandling();

    const [vedtak, dispatch] = useReducer(
        SøknadsbehandlingReducer,
        behandling,
        initieltVedtakSkjema,
    );

    const begrunnelseRef = useRef<HTMLTextAreaElement>(null);
    const brevtekstRef = useRef<HTMLTextAreaElement>(null);
    const barnetilleggBegrunnelseRef = useRef<HTMLTextAreaElement>(null);

    const getBegrunnelse = useCallback(
        () => begrunnelseRef.current?.value.trim() ?? '',
        [begrunnelseRef],
    );
    const getBrevtekst = useCallback(
        () => brevtekstRef.current?.value.trim() ?? '',
        [brevtekstRef],
    );
    const getBarnetilleggBegrunnelse = useCallback(
        () => barnetilleggBegrunnelseRef.current?.value.trim() ?? '',
        [barnetilleggBegrunnelseRef],
    );

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider
                value={{
                    ...vedtak,
                    textAreas: {
                        begrunnelse: {
                            ref: begrunnelseRef,
                            get: getBegrunnelse,
                        },
                        brevtekst: {
                            ref: brevtekstRef,
                            get: getBrevtekst,
                        },
                        barnetilleggBegrunnelse: {
                            ref: barnetilleggBegrunnelseRef,
                            get: getBarnetilleggBegrunnelse,
                        },
                    },
                }}
            >
                {children}
            </StateContext.Provider>
        </DispatchContext.Provider>
    );
};

export const useSøknadsbehandlingSkjema = () => {
    return useContext(StateContext);
};

export const useSøknadsbehandlingSkjemaDispatch = () => {
    return useContext(DispatchContext);
};
