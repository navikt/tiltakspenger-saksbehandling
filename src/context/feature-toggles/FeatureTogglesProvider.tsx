import { ReactNode } from 'react';
import { FeatureTogglesContext } from './FeatureTogglesContext';

type Props = {
    env: NodeJS.ProcessEnv['NAIS_CLUSTER_NAME'];
    children: ReactNode;
};

export const FeatureTogglesProvider = ({ env, children }: Props) => {
    const isProd = env === 'prod-gcp';

    return (
        <FeatureTogglesContext.Provider
            value={{
                brukersMeldekortToggle: !isProd,
                revurderingStansToggle: !isProd,
            }}
        >
            {children}
        </FeatureTogglesContext.Provider>
    );
};
