import {
    VedtakData,
    VedtakMedResultat,
    VedtakTilBeslutterDTO,
} from '../../../../types/VedtakTyper';
import { BehandlingData } from '../../../../types/BehandlingTypes';
import { useFetchFraApi } from '../../../../utils/useFetchFraApi';

export const useSendFørstegangsbehandling = (vedtak: VedtakData, behandling: BehandlingData) => {
    const { trigger, isMutating, error } = useFetchFraApi<BehandlingData, VedtakTilBeslutterDTO>(
        `/sak/${behandling.sakId}/behandling/${behandling.id}/sendtilbeslutning`,
        'POST',
    );

    const sendTilBeslutter = () => trigger(tilBeslutterDTO(vedtak as VedtakMedResultat));

    return {
        sendTilBeslutter,
        sendTilBeslutterLaster: isMutating,
        sendTilBeslutterError: error,
    };
};

const tilBeslutterDTO = (vedtak: VedtakMedResultat): VedtakTilBeslutterDTO => {
    return {
        begrunnelseVilkårsvurdering: vedtak.begrunnelseVilkårsvurdering,
        fritekstTilVedtaksbrev: vedtak.fritekstTilVedtaksbrev,
        innvilgelsesperiode: vedtak.innvilgelsesPeriode,
    };
};
