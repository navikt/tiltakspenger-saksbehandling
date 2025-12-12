import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { ManueltRegistrertSøknad } from '~/components/manuell-søknad/ManueltRegistrertSøknad';
import { Søknadsbehandling } from '~/types/Søknadsbehandling';

export const useOpprettSøknad = (saksnummer: string) => {
    const {
        trigger: opprettSøknad,
        isMutating: opprettSøknadLaster,
        error: opprettSøknadError,
    } = useFetchJsonFraApi<Søknadsbehandling, ManueltRegistrertSøknad>(
        `/sak/${saksnummer}/soknad`,
        'POST',
    );

    return {
        opprettSøknad,
        opprettSøknadLaster,
        opprettSøknadError,
    };
};
