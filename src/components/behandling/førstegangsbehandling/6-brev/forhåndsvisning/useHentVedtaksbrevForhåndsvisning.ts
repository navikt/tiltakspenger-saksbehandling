import { useFetchBlobFraApi } from '../../../../../utils/fetch/useFetchFraApi';
import {
    Avslagsgrunn,
    BehandlingData,
    Behandlingsutfall,
} from '../../../../../types/BehandlingTypes';
import { Periode } from '../../../../../types/Periode';
import { VedtakBarnetilleggPeriode } from '../../../../../types/VedtakTyper';
import { Nullable } from '../../../../../types/common';

type BrevForhåndsvisningDTO = {
    fritekst: string;
    virkningsperiode: Periode;
    barnetillegg: VedtakBarnetilleggPeriode[];
    utfall: Behandlingsutfall;
    avslagsgrunner: Nullable<Avslagsgrunn[]>;
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
