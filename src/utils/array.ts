import { ArrayOrSingle } from '~/types/UtilTypes';

export const forceArray = <T>(arrayOrSingle: ArrayOrSingle<T>): T[] =>
    Array.isArray(arrayOrSingle) ? arrayOrSingle : [arrayOrSingle];

// Hvis isEqualPredicate ikke er definert, sjekkes duplikater av primitive verdier eller referanser
export const removeDuplicatesFilter = <Type>(isEqualPredicate?: (a: Type, b: Type) => boolean) =>
    isEqualPredicate
        ? (aItem: Type, aIndex: number, array: Type[] | ReadonlyArray<Type>) => {
              const bIndex = array.findIndex((bItem) => isEqualPredicate(aItem, bItem));
              return aIndex === bIndex;
          }
        : (item: Type, index: number, array: Type[] | ReadonlyArray<Type>) =>
              array.indexOf(item) === index;
