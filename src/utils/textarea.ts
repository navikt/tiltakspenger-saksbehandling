import { RefObject } from 'react';
import { Nullable } from '~/types/UtilTypes';

export type TextAreaInput = {
    ref: RefObject<HTMLTextAreaElement>;
    get: () => string;
};

export const getTextAreaRefValue = (
    ref: RefObject<HTMLTextAreaElement>,
    ssrValue?: Nullable<string>,
): string => {
    return ref.current ? ref.current.value : (ssrValue ?? '');
};
