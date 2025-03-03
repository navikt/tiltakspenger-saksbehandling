import { ArrayOrSingle } from '../types/UtilTypes';

export const forceArray = <T>(arrayOrSingle: ArrayOrSingle<T>): T[] =>
    Array.isArray(arrayOrSingle) ? arrayOrSingle : [arrayOrSingle];

export const singleOrFirst = <T>(arrayOrSingle: ArrayOrSingle<T>): T =>
    Array.isArray(arrayOrSingle) ? arrayOrSingle[0] : arrayOrSingle;
