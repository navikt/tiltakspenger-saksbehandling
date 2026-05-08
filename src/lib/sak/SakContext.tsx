import { SakProps } from '~/lib/sak/SakTyper';
import React, { createContext, useContext } from 'react';
import { useResettableState } from '~/hooks/useResettableState';

type ContextState = {
    sak: SakProps;
    setSak: (sak: SakProps) => void;
};

const Context = createContext<ContextState>({} as ContextState);

type Props = React.PropsWithChildren<{
    sak: SakProps;
}>;

export const SakProvider = ({ sak: initialSak, children }: Props) => {
    const [sak, setSak] = useResettableState<SakProps>(initialSak);

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
