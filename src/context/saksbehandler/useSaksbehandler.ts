import { SaksbehandlerContext } from './SaksbehandlerContext';
import { useContext } from 'react';

export const useSaksbehandler = () => {
    return useContext(SaksbehandlerContext);
};
