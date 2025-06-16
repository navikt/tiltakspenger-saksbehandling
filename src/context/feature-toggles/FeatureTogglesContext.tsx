import { createContext, ReactNode, useContext } from 'react';

type TogglesRecord = Record<`${string}Toggle`, boolean>;

const featureTogglesDefaultState = {
    meldekortKorrigeringToggle: false,
    revurderingInnvilgelseToggle: false,
} as const satisfies TogglesRecord;

type FeatureTogglesState = Record<keyof typeof featureTogglesDefaultState, boolean>;

const Context = createContext<FeatureTogglesState>(featureTogglesDefaultState);

type Props = {
    deployEnv: NodeJS.ProcessEnv['NAIS_CLUSTER_NAME'];
    children: ReactNode;
};

export const FeatureTogglesProvider = ({ deployEnv, children }: Props) => {
    const isProd = deployEnv === 'prod-gcp';
    const isLocal = !deployEnv;

    return (
        <Context.Provider
            value={{
                meldekortKorrigeringToggle: !isProd,
                revurderingInnvilgelseToggle: isLocal,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export const useFeatureToggles = () => {
    return useContext(Context);
};
