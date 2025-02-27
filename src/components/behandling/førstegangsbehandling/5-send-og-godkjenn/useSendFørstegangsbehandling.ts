import { VedtakData, VedtakTilBeslutterDTO } from '../../../../types/VedtakTyper';
import { BehandlingData } from '../../../../types/BehandlingTypes';
import { useFetchJsonFraApi } from '../../../../utils/fetch/useFetchFraApi';

export const useSendFørstegangsbehandling = (vedtak: VedtakData, behandling: BehandlingData) => {
    const { trigger, isMutating, error } = useFetchJsonFraApi<
        BehandlingData,
        VedtakTilBeslutterDTO
    >(`/sak/${behandling.sakId}/behandling/${behandling.id}/sendtilbeslutning`, 'POST');

    const sendTilBeslutter = () => trigger(tilBeslutterDTO(vedtak));

    return {
        sendTilBeslutter,
        sendTilBeslutterLaster: isMutating,
        sendTilBeslutterError: error,
    };
};

const tilBeslutterDTO = (vedtak: VedtakData): VedtakTilBeslutterDTO => {
    return {
        begrunnelseVilkårsvurdering: vedtak.begrunnelseVilkårsvurdering,
        fritekstTilVedtaksbrev: vedtak.fritekstTilVedtaksbrev,
        innvilgelsesperiode: vedtak.innvilgelsesPeriode,
        barnetillegg: {
            begrunnelse: vedtak.barnetillegg?.begrunnelse,
            perioder: vedtak.barnetillegg?.barnetilleggForPeriode,
        },
    };
};
