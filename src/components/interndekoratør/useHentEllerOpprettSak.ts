import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

type HentEllerOpprettSakDTO = {
    fnr: string;
};

export const useHentEllerOpprettSak = () => {
    const {
        trigger: hentEllerOpprettSak,
        isMutating: isHentEllerOpprettSakMutating,
        error: hentEllerOpprettSakError,
    } = useFetchJsonFraApi<string, HentEllerOpprettSakDTO>(`/sak`, 'PUT');

    return { hentEllerOpprettSak, isHentEllerOpprettSakMutating, hentEllerOpprettSakError };
};
