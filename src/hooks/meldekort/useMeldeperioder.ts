import { MeldeperioderContext } from '../../context/meldeperioder/MeldeperioderContext';
import { useContext } from 'react';

export const useMeldeperioder = () => {
    return useContext(MeldeperioderContext);
};
