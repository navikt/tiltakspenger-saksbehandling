import { useFetchJsonFraApi } from '../../../utils/fetch/useFetchFraApi';
import { SakId } from '~/types/Sak';
import { Revurdering } from '~/types/Revurdering';
import { VedtakOpprettRevurdering } from '~/types/Vedtak';

export const useOpprettPapirsøknad = (sakId: SakId) => {
    const {
        trigger: opprettPapirsøknad,
        isMutating: opprettPapirsøknadLaster,
        error: opprettPapirsøknadError,
        // TODO Denne har ikke noe revurdering å gjøre, det er bare kopiert kode enn så lenge.
    } = useFetchJsonFraApi<Revurdering, VedtakOpprettRevurdering>(
        `/sak/${sakId}/papirsoknad`,
        'POST',
    );

    return {
        opprettPapirsøknad,
        opprettPapirsøknadLaster,
        opprettPapirsøknadError,
    };
};
