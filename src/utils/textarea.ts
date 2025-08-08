import { RefObject } from 'react';
import { Nullable } from '~/types/UtilTypes';

export type TextAreaInput = {
    ref: RefObject<HTMLTextAreaElement>;
    getValue: () => string;
};

export const getTextAreaRefValue = (
    ref: RefObject<HTMLTextAreaElement>,
    ssrValue?: Nullable<string>,
): string => {
    return ref.current ? ref.current.value : (ssrValue ?? '');
};
