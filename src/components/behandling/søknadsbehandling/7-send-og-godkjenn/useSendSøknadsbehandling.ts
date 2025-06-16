import { VedtakTilBeslutningDTO } from '../../../../types/VedtakTyper';
import { BehandlingData, BehandlingResultat } from '../../../../types/BehandlingTypes';
import { useFetchJsonFraApi } from '../../../../utils/fetch/useFetchFraApi';
import { SøknadsbehandlingVedtakContext } from '../context/SøknadsbehandlingVedtakContext';

export const useSendSøknadsbehandling = (
    behandling: BehandlingData,
    vedtak: SøknadsbehandlingVedtakContext,
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

const tilBeslutningDTO = (vedtak: SøknadsbehandlingVedtakContext): VedtakTilBeslutningDTO => {
    return {
        begrunnelseVilkårsvurdering: vedtak.getBegrunnelse(),
        fritekstTilVedtaksbrev: vedtak.getBrevtekst(),
        behandlingsperiode: vedtak.behandlingsperiode,
        barnetillegg:
            vedtak.resultat === BehandlingResultat.INNVILGELSE && vedtak.harBarnetillegg
                ? {
                      begrunnelse: vedtak.getBarnetilleggBegrunnelse(),
                      perioder: vedtak.barnetilleggPerioder ?? [],
                  }
                : null,
        valgteTiltaksdeltakelser: vedtak.valgteTiltaksdeltakelser,
        antallDagerPerMeldeperiode: vedtak.antallDagerPerMeldeperiode,
        avslagsgrunner:
            vedtak.resultat === BehandlingResultat.AVSLAG && vedtak.avslagsgrunner !== null
                ? vedtak.avslagsgrunner
                : null,
        //Validering skal fange at resultatet ikke er null
        resultat: vedtak.resultat!,
    };
};
