import { useFetchBlobFraApi } from '../../../../../utils/fetch/useFetchFraApi';
import { BehandlingData } from '../../../../../types/BehandlingTypes';
import { Periode } from '../../../../../types/Periode';
import { VedtakBarnetilleggPeriode } from '../../../../../types/VedtakTyper';

type BrevForhåndsvisningDTO = {
    fritekst: string;
    virkningsperiode: Periode;
    barnetillegg: VedtakBarnetilleggPeriode[];
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
