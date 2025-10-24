import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { SakId } from '~/types/Sak';
import { Papirsøknad } from '~/components/papirsøknad/papirsøknadTypes';

export const useOpprettPapirsøknad = (sakId: SakId) => {
    const {
        trigger: opprettPapirsøknad,
        isMutating: opprettPapirsøknadLaster,
        error: opprettPapirsøknadError,
    } = useFetchJsonFraApi<Papirsøknad, Papirsøknad>(`/sak/${sakId}/papirsoknad`, 'POST');

    return {
        opprettPapirsøknad,
        opprettPapirsøknadLaster,
        opprettPapirsøknadError,
    };
};
