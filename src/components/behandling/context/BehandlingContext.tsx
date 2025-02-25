import { BehandlingData } from '../../../types/BehandlingTypes';
import { createContext, ReactNode, useContext, useState } from 'react';
import { kanBeslutteForBehandling, kanSaksbehandleForBehandling } from '../../../utils/tilganger';
import { useSaksbehandler } from '../../../context/saksbehandler/useSaksbehandler';
import { SaksbehandlerRolle } from '../../../types/Saksbehandler';

export type BehandlingContextState<Behandling extends BehandlingData> = {
    behandling: Behandling;
    setBehandling: (behandling: BehandlingData) => void;
    rolleForBehandling: SaksbehandlerRolle.SAKSBEHANDLER | SaksbehandlerRolle.BESLUTTER | null;
};

const BehandlingContext = createContext({} as BehandlingContextState<BehandlingData>);

export const useBehandling = () => {
    return useContext(BehandlingContext);
};

type ProviderProps = {
    behandling: BehandlingData;
    children: ReactNode;
};

export const BehandlingProvider = ({ behandling: initialBehandling, children }: ProviderProps) => {
    const [behandling, setBehandling] = useState<BehandlingData>(initialBehandling);

    const { innloggetSaksbehandler } = useSaksbehandler();

    const rolleForBehandling = kanSaksbehandleForBehandling(behandling, innloggetSaksbehandler)
        ? SaksbehandlerRolle.SAKSBEHANDLER
        : kanBeslutteForBehandling(behandling, innloggetSaksbehandler)
          ? SaksbehandlerRolle.BESLUTTER
          : null;

    return (
        <BehandlingContext.Provider
            value={{
                behandling,
                setBehandling,
                rolleForBehandling,
            }}
        >
            {children}
        </BehandlingContext.Provider>
    );
};
