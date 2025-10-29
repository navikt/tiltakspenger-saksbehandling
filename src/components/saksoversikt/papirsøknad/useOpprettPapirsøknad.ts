import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { Papirsøknad } from '~/components/papirsøknad/papirsøknadTypes';
import { Søknadsbehandling } from '~/types/Søknadsbehandling';

export const useOpprettPapirsøknad = (saksnummer: string) => {
    const {
        trigger: opprettPapirsøknad,
        isMutating: opprettPapirsøknadLaster,
        error: opprettPapirsøknadError,
    } = useFetchJsonFraApi<Søknadsbehandling, Papirsøknad>(
        `/sak/${saksnummer}/papirsoknad`,
        'POST',
    );

    return {
        opprettPapirsøknad,
        opprettPapirsøknadLaster,
        opprettPapirsøknadError,
    };
};
