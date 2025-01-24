import { ReactNode } from 'react';
import { FeatureTogglesContext } from './FeatureTogglesContext';

type Props = {
    deployEnv: NodeJS.ProcessEnv['NAIS_CLUSTER_NAME'];
    children: ReactNode;
};

export const FeatureTogglesProvider = ({ deployEnv, children }: Props) => {
    const isProd = deployEnv === 'prod-gcp';

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
