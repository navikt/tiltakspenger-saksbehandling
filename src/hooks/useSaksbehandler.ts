import { SaksbehandlerContext } from '../context/saksbehandler/SaksbehandlerContext';
import { useContext } from 'react';

export const useSaksbehandler = () => {
    const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);

    if (!innloggetSaksbehandler) {
        throw new Error('Mangler innlogget saksbehandler!');
    }

    return { innloggetSaksbehandler };
};
