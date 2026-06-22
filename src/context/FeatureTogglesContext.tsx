import { createContext, ReactNode, useContext } from 'react';

type TogglesRecord = Record<`${string}Toggle`, boolean>;

const featureTogglesDefaultState = {
    meldekortbehandlingV2Toggle: false,
} as const satisfies TogglesRecord;

type FeatureTogglesState = Record<keyof typeof featureTogglesDefaultState, boolean>;

const Context = createContext<FeatureTogglesState>(featureTogglesDefaultState);

type Props = {
    deployEnv: NodeJS.ProcessEnv['NAIS_CLUSTER_NAME'];
    children: ReactNode;
};

export const FeatureTogglesProvider = ({ deployEnv, children }: Props) => {
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    const isProd = deployEnv === 'prod-gcp';
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    const isLocal = !deployEnv;

    return (
        <Context.Provider
            value={{
                meldekortbehandlingV2Toggle: !isProd,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export const useFeatureToggles = () => {
    return useContext(Context);
};
