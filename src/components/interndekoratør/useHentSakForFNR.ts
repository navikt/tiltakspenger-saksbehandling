import { SakProps } from '../../types/SakTypes';
import { useFetchFraApi } from '../../utils/useFetchFraApi';

export const useHentSakForFNR = () => {
    const {
        trigger: søk,
        data: sak,
        error,
    } = useFetchFraApi<SakProps, { fnr: string }>('/sak', 'POST');

    return { søk, sak, error };
};
