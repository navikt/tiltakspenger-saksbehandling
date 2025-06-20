import {
    BehandlingData,
    Behandlingstype,
    SøknadsbehandlingData,
    RevurderingData,
} from '~/types/BehandlingTypes';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useRolleForBehandling } from '../../context/saksbehandler/SaksbehandlerContext';
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

    const rolleForBehandling = useRolleForBehandling(behandling);

    useEffect(() => {
        setBehandling(initialBehandling);
    }, [initialBehandling]);

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

export const useSøknadsbehandling = () => {
    const context = useContext(Context);

    if (context.behandling.type !== Behandlingstype.SØKNADSBEHANDLING) {
        throw Error(`Feil context for søknadsbehandling: ${context.behandling.type}`);
    }

    return context as BehandlingContext<SøknadsbehandlingData>;
};

export const useRevurderingBehandling = () => {
    const context = useContext(Context);

    if (context.behandling.type !== Behandlingstype.REVURDERING) {
        throw Error(`Feil context for revurdering: ${context.behandling.type}`);
    }

    return context as BehandlingContext<RevurderingData>;
};
