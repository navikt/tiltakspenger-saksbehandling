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
import { BarnetilleggBegrunnelseInput } from '~/components/behandling/felles/state/BarnetilleggState';
import { BegrunnelseOgBrevInput } from '~/components/behandling/felles/state/BegrunnelseOgBrev';
import { getTextAreaRefValue } from '~/utils/textarea';

export type SøknadsbehandlingVedtakContext = BegrunnelseOgBrevInput &
    BarnetilleggBegrunnelseInput &
    SøknadsbehandlingSkjemaState;

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
        () => getTextAreaRefValue(begrunnelseRef, behandling.begrunnelseVilkårsvurdering),
        [begrunnelseRef, behandling.begrunnelseVilkårsvurdering],
    );
    const getBrevtekst = useCallback(
        () => getTextAreaRefValue(brevtekstRef, behandling.fritekstTilVedtaksbrev),
        [brevtekstRef, behandling.fritekstTilVedtaksbrev],
    );
    const getBarnetilleggBegrunnelse = useCallback(
        () => getTextAreaRefValue(barnetilleggBegrunnelseRef, behandling.barnetillegg?.begrunnelse),
        [barnetilleggBegrunnelseRef, behandling.barnetillegg],
    );

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider
                value={{
                    ...vedtak,
                    textAreas: {
                        begrunnelse: {
                            ref: begrunnelseRef,
                            getValue: getBegrunnelse,
                        },
                        brevtekst: {
                            ref: brevtekstRef,
                            getValue: getBrevtekst,
                        },
                        barnetilleggBegrunnelse: {
                            ref: barnetilleggBegrunnelseRef,
                            getValue: getBarnetilleggBegrunnelse,
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
