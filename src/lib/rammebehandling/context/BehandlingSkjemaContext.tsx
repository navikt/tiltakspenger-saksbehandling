import {
    createContext,
    Dispatch,
    PropsWithChildren,
    useContext,
    useReducer,
    useState,
} from 'react';
import { useBehandling } from '~/lib/rammebehandling/context/BehandlingContext';
import {
    BehandlingSkjemaActions,
    behandlingSkjemaReducer,
    BehandlingSkjemaState,
} from '~/lib/rammebehandling/context/behandlingSkjemaReducer';
import {
    Rammebehandling,
    Rammebehandlingsstatus,
    Rammebehandlingstype,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import { useSak } from '~/lib/sak/SakContext';
import { SakProps } from '~/lib/sak/SakTyper';
import { TextAreaInput } from '~/lib/_felles/fritekst/fritekstUtils';
import { useFritekstInput } from '~/lib/_felles/fritekst/useFritekstInput';
import { rammebehandlingMedInnvilgelseEllerNull } from '~/lib/rammebehandling/rammebehandlingUtils';
import { søknadsbehandlingInitialState } from '~/lib/rammebehandling/context/søknadsbehandling/søknadsbehandlingInitialState';
import { revurderingInitialState } from '~/lib/rammebehandling/context/revurdering/revurderingInitialState';
import { SaksbehandlerRolle } from '~/lib/saksbehandler/SaksbehandlerTyper';
import { erBehandlingSattPåVent } from '~/lib/behandling-felles/utils/behandlingUtils';

export type BehandlingSkjemaContextBase<T> = T & {
    erReadonly: boolean;
    textAreas: {
        begrunnelse: TextAreaInput;
        brevtekst: TextAreaInput;
        barnetilleggBegrunnelse: TextAreaInput;
    };
    journalføring: {
        skalJournalføreNotat: boolean;
        setSkalJournalføreNotat: (skalJournalføreNotat: boolean) => void;
    };
};

export type BehandlingSkjemaContext = BehandlingSkjemaContextBase<BehandlingSkjemaState>;

// Separate contexts for å hindre re-renders for komponenter som kun bruker dispatch
const StateContext = createContext({} as BehandlingSkjemaContext);
const DispatchContext = createContext((() => ({})) as Dispatch<BehandlingSkjemaActions>);

// Key for å sikre at skjema state resettes når behandlingen endres
export const BehandlingSkjemaProvider = ({ children }: PropsWithChildren) => {
    const { behandling } = useBehandling();
    const { id, sistEndret, saksopplysninger } = behandling;

    return (
        <BehandlingSkjemaProviderInner
            key={`${id}-${sistEndret}-${saksopplysninger.oppslagstidspunkt}`}
        >
            {children}
        </BehandlingSkjemaProviderInner>
    );
};

const BehandlingSkjemaProviderInner = ({ children }: PropsWithChildren) => {
    const { sak } = useSak();
    const { behandling, rolleForBehandling } = useBehandling();

    const erReadonly =
        rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER ||
        behandling.status !== Rammebehandlingsstatus.UNDER_BEHANDLING ||
        erBehandlingSattPåVent(behandling);

    const [skjema, dispatch] = useReducer(
        behandlingSkjemaReducer,
        { behandling, sak },
        initialState,
    );

    const [skalJournalføreNotat, setSkalJournalføreNotat] = useState(
        behandling.skalJournalføreNotat,
    );

    const begrunnelse = useFritekstInput(behandling.begrunnelseVilkårsvurdering);
    const brevtekst = useFritekstInput(behandling.fritekstTilVedtaksbrev);
    const barnetilleggBegrunnelse = useFritekstInput(
        rammebehandlingMedInnvilgelseEllerNull(behandling)?.barnetillegg?.begrunnelse,
    );

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider
                value={{
                    ...skjema,
                    erReadonly,
                    textAreas: {
                        begrunnelse,
                        brevtekst,
                        barnetilleggBegrunnelse,
                    },
                    journalføring: {
                        skalJournalføreNotat,
                        setSkalJournalføreNotat,
                    },
                }}
            >
                {children}
            </StateContext.Provider>
        </DispatchContext.Provider>
    );
};

const initialState = ({
    behandling,
    sak,
}: {
    behandling: Rammebehandling;
    sak: SakProps;
}): BehandlingSkjemaState => {
    return behandling.type === Rammebehandlingstype.SØKNADSBEHANDLING
        ? søknadsbehandlingInitialState(behandling)
        : revurderingInitialState(behandling, sak);
};

export const useBehandlingSkjema = () => {
    return useContext(StateContext);
};

export const useBehandlingSkjemaDispatch = () => {
    return useContext(DispatchContext);
};
