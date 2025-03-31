import { createContext, ReactNode, useContext } from 'react';

type ConfigState = {
    gosysUrl: string;
    modiaPersonoversiktUrl: string;
};

const defaultConfigState: ConfigState = {
    gosysUrl: '',
    modiaPersonoversiktUrl: '',
};

const Context = createContext<ConfigState>(defaultConfigState);

type Props = {
    gosysUrl: string;
    modiaPersonoversiktUrl: string;
    children: ReactNode;
};

export const ConfigProvider = ({ gosysUrl, modiaPersonoversiktUrl, children }: Props) => {
    return (
        <Context.Provider
            value={{
                gosysUrl,
                modiaPersonoversiktUrl,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export const useConfig = () => {
    return useContext(Context);
};
