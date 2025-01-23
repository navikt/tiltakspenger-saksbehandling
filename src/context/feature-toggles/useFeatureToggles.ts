import { FeatureTogglesContext } from './FeatureTogglesContext';
import { useContext } from 'react';

export const useFeatureToggles = () => {
    return useContext(FeatureTogglesContext);
};
