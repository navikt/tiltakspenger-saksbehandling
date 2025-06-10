import { BehandlingData, BehandlingResultat } from '../../../../../../types/BehandlingTypes';
import { useFetchBlobFraApi } from '../../../../../../utils/fetch/useFetchFraApi';

type BrevForhåndsvisningDTO = {
    fritekst: string;
    stansDato: string;
    valgteHjemler: string[];
    resultat: BehandlingResultat;
};

export const useHentVedtaksbrevForhåndsvisning = (behandling: BehandlingData) => {
    const { trigger, error, isMutating } = useFetchBlobFraApi<BrevForhåndsvisningDTO>(
        `/sak/${behandling.sakId}/behandling/${behandling.id}/forhandsvis`,
        'POST',
    );

    return {
        hentForhåndsvisning: trigger,
        forhåndsvisningError: error,
        forhåndsvisningLaster: isMutating,
    };
};
