import { Dispatch, SetStateAction, useState } from 'react';

/**
 * En state-hook som resetter seg selv når `initialValue` endrer seg.
 */
export const useResettableState = <T>(initialValue: T): [T, Dispatch<SetStateAction<T>>] => {
    const [state, setState] = useState<T>(initialValue);
    const [prevInitialValue, setPrevInitialValue] = useState<T>(initialValue);

    if (initialValue !== prevInitialValue) {
        setPrevInitialValue(initialValue);
        setState(initialValue);
    }

    return [state, setState];
};
