import { useFetchBlobFraApi } from '../../../../utils/fetch/useFetchFraApi';
import { BehandlingData } from '../../../../types/BehandlingTypes';
import { Periode } from '../../../../types/Periode';

type BrevForhåndsvisningDTO = {
    fritekst: string;
    virkningsperiode: Periode;
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
