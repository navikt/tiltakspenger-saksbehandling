import { SakProps } from '../../types/Sak';
import { useFetchJsonFraApi } from '../../utils/fetch/useFetchFraApi';

export const useHentSakForFNR = () => {
    const {
        trigger: søk,
        data: sak,
        error,
        reset,
    } = useFetchJsonFraApi<SakProps, { fnr: string }>('/sak', 'POST');

    return { søk, sak, error, reset };
};
