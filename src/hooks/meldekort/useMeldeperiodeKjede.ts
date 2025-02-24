import { MeldeperiodeKjedeContext } from '../../context/meldeperioder/MeldeperiodeKjedeContext';
import { useContext } from 'react';

export const useMeldeperiodeKjede = () => {
    return useContext(MeldeperiodeKjedeContext);
};
