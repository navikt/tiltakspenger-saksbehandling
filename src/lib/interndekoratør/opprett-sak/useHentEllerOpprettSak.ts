import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

type HentEllerOpprettSakRequest = {
    fnr: string;
};

type HentEllerOpprettSakResponse = {
    saksnummer: string;
    opprettet: boolean;
};

export const useHentEllerOpprettSak = () => {
    const {
        trigger: hentEllerOpprettSak,
        isMutating: isHentEllerOpprettSakMutating,
        error: hentEllerOpprettSakError,
    } = useFetchJsonFraApi<HentEllerOpprettSakResponse, HentEllerOpprettSakRequest>(`/sak`, 'PUT');

    return { hentEllerOpprettSak, isHentEllerOpprettSakMutating, hentEllerOpprettSakError };
};
