import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useRolleForBehandling } from '~/context/saksbehandler/SaksbehandlerContext';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { Behandling, Behandlingstype } from '~/types/Behandling';

import { Søknadsbehandling } from '~/types/Søknadsbehandling';
import { Revurdering } from '~/types/Revurdering';

type BehandlingContext<out T extends Behandling> = {
    behandling: T;
    setBehandling: (behandling: Behandling) => void;
    rolleForBehandling: SaksbehandlerRolle.SAKSBEHANDLER | SaksbehandlerRolle.BESLUTTER | null;
};

const Context = createContext({} as BehandlingContext<Behandling>);

type Props = {
    behandling: Behandling;
    children: ReactNode;
};

export const BehandlingProvider = ({ behandling: initialBehandling, children }: Props) => {
    const [behandling, setBehandling] = useState<Behandling>(initialBehandling);

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

    return context as BehandlingContext<Søknadsbehandling>;
};

export const useRevurderingBehandling = () => {
    const context = useContext(Context);

    if (context.behandling.type !== Behandlingstype.REVURDERING) {
        throw Error(`Feil context for revurdering: ${context.behandling.type}`);
    }

    return context as BehandlingContext<Revurdering>;
};
