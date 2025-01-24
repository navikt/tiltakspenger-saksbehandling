import { createContext } from 'react';

type TogglesRecord = Record<`${string}Toggle`, boolean>;

const featureTogglesDefaultState = {
    brukersMeldekortToggle: false,
    revurderingStansToggle: false,
} as const satisfies TogglesRecord;

type FeatureTogglesState = Record<keyof typeof featureTogglesDefaultState, boolean>;

export const FeatureTogglesContext = createContext<FeatureTogglesState>(featureTogglesDefaultState);
