import { createContext } from 'react';

type FeatureTogglesContextState = {
    brukersMeldekort: boolean;
};

export const FeatureTogglesContext = createContext<FeatureTogglesContextState>({
    brukersMeldekort: false,
});
