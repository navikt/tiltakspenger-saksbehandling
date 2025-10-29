import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useRolleForBehandling } from '~/context/saksbehandler/SaksbehandlerContext';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { RammebehandlingResultat, Behandlingstype, Rammebehandling } from '~/types/Behandling';
import { Søknadsbehandling } from '~/types/Søknadsbehandling';
import { Revurdering, RevurderingOmgjøring } from '~/types/Revurdering';

type BehandlingContext<Rammebehandling> = {
    behandling: Rammebehandling;
    setBehandling: (behandling: Rammebehandling) => void;
    rolleForBehandling: SaksbehandlerRolle.SAKSBEHANDLER | SaksbehandlerRolle.BESLUTTER | null;
};

const Context = createContext({} as BehandlingContext<Rammebehandling>);

type Props = {
    behandling: Rammebehandling;
    children: ReactNode;
};

export const BehandlingProvider = ({ behandling: initialBehandling, children }: Props) => {
    const [behandling, setBehandling] = useState<Rammebehandling>(initialBehandling);

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

export const useRevurderingOmgjøring = () => {
    const context = useRevurderingBehandling();

    if (context.behandling.resultat !== RammebehandlingResultat.OMGJØRING) {
        throw Error(`Feil context for revurdering omgjøring: ${context.behandling.resultat}`);
    }

    return context as BehandlingContext<RevurderingOmgjøring>;
};
