import {
    BehandlingData,
    Behandlingstype,
    FørstegangsbehandlingData,
    RevurderingData,
} from '../../types/BehandlingTypes';
import { createContext, ReactNode, useContext, useState } from 'react';
import { kanBeslutteForBehandling, kanSaksbehandleForBehandling } from '../../utils/tilganger';
import { useSaksbehandler } from '../../context/saksbehandler/useSaksbehandler';
import { SaksbehandlerRolle } from '../../types/Saksbehandler';

export type BehandlingContext<Behandling extends BehandlingData> = {
    behandling: Behandling;
    setBehandling: (behandling: BehandlingData) => void;
    rolleForBehandling: SaksbehandlerRolle.SAKSBEHANDLER | SaksbehandlerRolle.BESLUTTER | null;
};

const Context = createContext({} as BehandlingContext<BehandlingData>);

type Props = {
    behandling: BehandlingData;
    children: ReactNode;
};

export const BehandlingProvider = ({ behandling: initialBehandling, children }: Props) => {
    const [behandling, setBehandling] = useState<BehandlingData>(initialBehandling);

    const { innloggetSaksbehandler } = useSaksbehandler();

    const rolleForBehandling = kanSaksbehandleForBehandling(behandling, innloggetSaksbehandler)
        ? SaksbehandlerRolle.SAKSBEHANDLER
        : kanBeslutteForBehandling(behandling, innloggetSaksbehandler)
          ? SaksbehandlerRolle.BESLUTTER
          : null;

    return (
        <Context.Provider
            value={{
                behandling,
                setBehandling,
                rolleForBehandling,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export const useBehandling = () => {
    return useContext(Context);
};

export const useFørstegangsbehandling = () => {
    const context = useContext(Context);

    if (context.behandling.type !== Behandlingstype.FØRSTEGANGSBEHANDLING) {
        throw Error(`Feil context for førstegangsbehandling: ${context.behandling.type}`);
    }

    return context as BehandlingContext<FørstegangsbehandlingData>;
};

export const useRevurderingBehandling = () => {
    const context = useContext(Context);

    if (context.behandling.type !== Behandlingstype.REVURDERING) {
        throw Error(`Feil context for revurdering: ${context.behandling.type}`);
    }

    return context as BehandlingContext<RevurderingData>;
};
