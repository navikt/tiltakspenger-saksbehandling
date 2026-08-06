import { RefObject } from 'react';
import { Nullable } from '~/types/UtilTypes';

export type TextAreaInput = {
    ref: RefObject<HTMLTextAreaElement | null>;
    getValue: () => Nullable<string>;
};

// Skal returnere null dersom tekstfeltet er tomt eller kun whitespace
export const getTextAreaRefValue = (
    ref: RefObject<HTMLTextAreaElement | null>,
    ssrValue?: Nullable<string>,
): Nullable<string> => {
    return (ref.current ? ref.current.value : ssrValue)?.trim() || null;
};
