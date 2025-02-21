import { SaksbehandlerContext } from '../context/saksbehandler/SaksbehandlerContext';
import { useContext } from 'react';

export const useSaksbehandler = () => {
    return useContext(SaksbehandlerContext);
};
