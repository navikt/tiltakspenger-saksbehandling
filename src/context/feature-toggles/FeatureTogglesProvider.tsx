import { ReactNode } from 'react';
import { FeatureTogglesContext } from './FeatureTogglesContext';

type Props = {
    env: NodeJS.ProcessEnv['NAIS_CLUSTER_NAME'];
    children: ReactNode;
};

export const FeatureTogglesProvider = ({ env, children }: Props) => {
    console.log(`Env: ${env}`);

    return (
        <FeatureTogglesContext.Provider
            value={{
                brukersMeldekort: env !== 'prod-gcp',
            }}
        >
            {children}
        </FeatureTogglesContext.Provider>
    );
};
