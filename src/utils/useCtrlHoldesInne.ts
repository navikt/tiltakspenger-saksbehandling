import { useEffect, useState } from 'react';

/**
 * Om ctrl-tasten (eller cmd på mac) holdes inne.
 */
export const useCtrlHoldesInne = () => {
    const [holdesInne, setHoldesInne] = useState(false);

    useEffect(() => {
        const tastListener = (e: KeyboardEvent) => {
            setHoldesInne(e.ctrlKey || e.metaKey);
        };
        // keyup fyres ikke dersom vinduet mister fokus mens tasten holdes inne (f.eks. ctrl+tab)
        const blurListener = () => setHoldesInne(false);

        window.addEventListener('keyup', tastListener);
        window.addEventListener('keydown', tastListener);
        window.addEventListener('blur', blurListener);
        return () => {
            window.removeEventListener('keyup', tastListener);
            window.removeEventListener('keydown', tastListener);
            window.removeEventListener('blur', blurListener);
        };
    }, []);

    return holdesInne;
};
