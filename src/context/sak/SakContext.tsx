import { SakProps } from '../../types/Sak';
import React, { createContext, useContext, useEffect, useState } from 'react';

type ContextState = {
    sak: SakProps;
    setSak: (sak: SakProps) => void;
};

const Context = createContext<ContextState>({} as ContextState);

type Props = React.PropsWithChildren<{
    sak: SakProps;
}>;

export const SakProvider = ({ sak: initialSak, children }: Props) => {
    const [sak, setSak] = useState<SakProps>(initialSak);

    useEffect(() => {
        setSak(initialSak);
    }, [initialSak]);

    return (
        <Context.Provider
            value={{
                sak,
                setSak,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export const useSak = () => {
    return useContext(Context);
};
