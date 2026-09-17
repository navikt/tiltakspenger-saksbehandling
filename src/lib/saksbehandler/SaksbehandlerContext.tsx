import { createContext, ReactNode, useContext } from 'react';
import { Saksbehandler, SaksbehandlerRolle } from './SaksbehandlerTyper';
import { hentRolleForBehandling } from '~/lib/saksbehandler/tilganger';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';

type SaksbehandlerState = {
    innloggetSaksbehandler: Saksbehandler;
    erSaksbehandler: boolean;
    erBeslutter: boolean;
    sladdes: boolean;
    kanSeBenken: boolean;
};

// Skal normalt kun brukes ved pre-render av statiske sider, ie feilsider.
// Vi henter ellers alltid innlogget saksbehandler for alle routes.
const defaultSaksbehandler: Saksbehandler = {
    brukernavn: 'ukjent',
    epost: 'ukjent',
    navIdent: 'ukjent',
    roller: [],
    sladdes: false,
    kanSeBenken: true,
} as const;

const Context = createContext<SaksbehandlerState>({
    innloggetSaksbehandler: defaultSaksbehandler,
    erSaksbehandler: false,
    erBeslutter: false,
    sladdes: false,
    kanSeBenken: true,
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
                sladdes: saksbehandler.sladdes,
                kanSeBenken: saksbehandler.kanSeBenken,
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
