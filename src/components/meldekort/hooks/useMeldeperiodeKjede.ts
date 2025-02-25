import { MeldeperiodeKjedeContext } from '../context/MeldeperiodeKjedeContext';
import { useContext } from 'react';

export const useMeldeperiodeKjede = () => {
    return useContext(MeldeperiodeKjedeContext);
};
