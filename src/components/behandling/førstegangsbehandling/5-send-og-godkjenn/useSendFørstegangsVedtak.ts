import { VedtakTilBeslutningDTO } from '../../../../types/VedtakTyper';
import { BehandlingData } from '../../../../types/BehandlingTypes';
import { useFetchJsonFraApi } from '../../../../utils/fetch/useFetchFraApi';
import { FørstegangsVedtakContext } from '../context/FørstegangsVedtakContext';

export const useSendFørstegangsVedtak = (
    behandling: BehandlingData,
    vedtak: FørstegangsVedtakContext,
) => {
    const { trigger, isMutating, error } = useFetchJsonFraApi<
        BehandlingData,
        VedtakTilBeslutningDTO
    >(`/sak/${behandling.sakId}/behandling/${behandling.id}/sendtilbeslutning`, 'POST');

    const sendTilBeslutning = () => trigger(tilBeslutningDTO(vedtak));

    return {
        sendTilBeslutning,
        sendTilBeslutningLaster: isMutating,
        sendTilBeslutningError: error,
    };
};

const tilBeslutningDTO = (vedtak: FørstegangsVedtakContext): VedtakTilBeslutningDTO => {
    return {
        begrunnelseVilkårsvurdering: vedtak.getBegrunnelse(),
        fritekstTilVedtaksbrev: vedtak.getBrevtekst(),
        innvilgelsesperiode: vedtak.innvilgelsesPeriode,
        barnetillegg: vedtak.harBarnetillegg
            ? {
                  begrunnelse: vedtak.getBarnetilleggBegrunnelse(),
                  perioder: vedtak.barnetilleggPerioder ?? [],
              }
            : null,
    };
};
