import { useContext } from 'react';
import { SakContext } from './SakContext';

export const useSak = () => {
    return useContext(SakContext);
};
