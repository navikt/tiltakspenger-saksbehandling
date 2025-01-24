import { FeatureTogglesContext } from '../context/feature-toggles/FeatureTogglesContext';
import { useContext } from 'react';

export const useFeatureToggles = () => {
    return useContext(FeatureTogglesContext);
};
