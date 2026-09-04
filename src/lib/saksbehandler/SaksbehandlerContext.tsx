import { createContext, ReactNode, useContext } from 'react';
import { Saksbehandler, SaksbehandlerRolle } from './SaksbehandlerTyper';
import { hentRolleForBehandling } from '~/lib/saksbehandler/tilganger';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';

type SaksbehandlerState = {
    innloggetSaksbehandler: Saksbehandler;
    erSaksbehandler: boolean;
    erBeslutter: boolean;
};

// Skal normalt kun brukes ved pre-render av statiske sider, ie feilsider.
// Vi henter ellers alltid innlogget saksbehandler for alle routes.
const defaultSaksbehandler: Saksbehandler = {
    brukernavn: 'ukjent',
    epost: 'ukjent',
    navIdent: 'ukjent',
    roller: [],
} as const;

const Context = createContext<SaksbehandlerState>({
    innloggetSaksbehandler: defaultSaksbehandler,
    erSaksbehandler: false,
    erBeslutter: false,
});

type Props = {
    children: ReactNode;
    initialSaksbehandler?: Saksbehandler;
};

export const SaksbehandlerProvider = ({ initialSaksbehandler, children }: Props) => {
    const saksbehandler = initialSaksbehandler || defaultSaksbehandler;

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
