import { SakId } from '../../../types/SakTypes';
import { useFetchJsonFraApi } from '../../../utils/fetch/useFetchFraApi';
import { RevurderingData } from '../../../types/BehandlingTypes';
import { VedtakOpprettRevurderingDTO } from '../../../types/VedtakTyper';

export const useOpprettPapirsøknad = (sakId: SakId) => {
    const {
        trigger: opprettPapirsøknad,
        isMutating: opprettPapirsøknadLaster,
        error: opprettPapirsøknadError,
    } = useFetchJsonFraApi<RevurderingData, VedtakOpprettRevurderingDTO>(
        `/sak/${sakId}/papirsoknad`,
        'POST',
    );

    return {
        opprettPapirsøknad,
        opprettPapirsøknadLaster,
        opprettPapirsøknadError,
    };
};
