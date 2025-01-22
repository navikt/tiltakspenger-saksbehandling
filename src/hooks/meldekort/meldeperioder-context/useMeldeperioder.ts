import { MeldeperioderContext } from './MeldeperioderContext';
import { useContext } from 'react';

export const useMeldeperioder = () => {
    return useContext(MeldeperioderContext);
};
