import { createContext, ReactNode, useContext } from 'react';
import { Saksbehandler, SaksbehandlerRolle } from './SaksbehandlerTyper';
import { hentRolleForBehandling } from '~/lib/saksbehandler/tilganger';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';

type SaksbehandlerState = {
    innloggetSaksbehandler: Saksbehandler;
    erSaksbehandler: boolean;
    erBeslutter: boolean;
};

const Context = createContext<SaksbehandlerState>({} as SaksbehandlerState);

type Props = {
    children: ReactNode;
    saksbehandler: Saksbehandler;
};

export const SaksbehandlerProvider = ({ saksbehandler, children }: Props) => {
    return (
        <Context.Provider
            value={{
                innloggetSaksbehandler: saksbehandler,
                erSaksbehandler: saksbehandler.roller.includes(SaksbehandlerRolle.SAKSBEHANDLER),
                erBeslutter: saksbehandler.roller.includes(SaksbehandlerRolle.BESLUTTER),
            }}
        >
            {children}
        </Context.Provider>
    );
};

export const useSaksbehandler = () => {
    return useContext(Context);
};

export const useRolleForBehandling = (behandling: Rammebehandling) => {
    return hentRolleForBehandling(behandling, useSaksbehandler().innloggetSaksbehandler);
};
