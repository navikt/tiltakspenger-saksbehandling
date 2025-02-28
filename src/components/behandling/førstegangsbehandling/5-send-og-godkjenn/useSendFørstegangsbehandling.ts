import { VedtakTilBeslutningDTO } from '../../../../types/VedtakTyper';
import { BehandlingData } from '../../../../types/BehandlingTypes';
import { useFetchJsonFraApi } from '../../../../utils/fetch/useFetchFraApi';
import { VedtakContextState } from '../context/FørstegangsbehandlingContext';

export const useSendFørstegangsbehandling = (
    behandling: BehandlingData,
    vedtakSkjema: VedtakContextState,
) => {
    const { trigger, isMutating, error } = useFetchJsonFraApi<
        BehandlingData,
        VedtakTilBeslutningDTO
    >(`/sak/${behandling.sakId}/behandling/${behandling.id}/sendtilbeslutning`, 'POST');

    const sendTilBeslutter = () => trigger(tilBeslutterDTO(vedtakSkjema));

    return {
        sendTilBeslutter,
        sendTilBeslutterLaster: isMutating,
        sendTilBeslutterError: error,
    };
};

const tilBeslutterDTO = (vedtak: VedtakContextState): VedtakTilBeslutningDTO => {
    return {
        begrunnelseVilkårsvurdering: vedtak.begrunnelseRef.current?.value ?? '',
        fritekstTilVedtaksbrev: vedtak.brevtekstRef.current?.value ?? '',
        innvilgelsesperiode: vedtak.innvilgelsesPeriode,
        barnetillegg: vedtak.harBarnetillegg
            ? {
                  begrunnelse: vedtak.barnetilleggBegrunnelseRef.current?.value ?? '',
                  perioder: vedtak.barnetilleggPerioder ?? [],
              }
            : null,
    };
};
