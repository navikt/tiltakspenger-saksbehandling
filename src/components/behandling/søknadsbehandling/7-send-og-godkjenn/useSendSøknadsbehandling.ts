import { VedtakTilBeslutningDTO } from '~/types/VedtakTyper';
import { BehandlingData, SøknadsbehandlingResultat } from '~/types/BehandlingTypes';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { SøknadsbehandlingVedtakContext } from '~/components/behandling/søknadsbehandling/context/SøknadsbehandlingVedtakContext';

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
            vedtak.resultat === SøknadsbehandlingResultat.INNVILGELSE && vedtak.harBarnetillegg
                ? {
                      begrunnelse: vedtak.getBarnetilleggBegrunnelse(),
                      perioder: vedtak.barnetilleggPerioder,
                  }
                : null,
        valgteTiltaksdeltakelser: vedtak.valgteTiltaksdeltakelser,
        antallDagerPerMeldeperiode:
            vedtak.resultat === SøknadsbehandlingResultat.INNVILGELSE
                ? vedtak.antallDagerPerMeldeperiode.map((dager) => ({
                      antallDagerPerMeldeperiode: dager.antallDagerPerMeldeperiode!,
                      periode: {
                          fraOgMed: dager.periode.fraOgMed!,
                          tilOgMed: dager.periode.tilOgMed!,
                      },
                  }))
                : null,
        avslagsgrunner:
            vedtak.resultat === SøknadsbehandlingResultat.AVSLAG ? vedtak.avslagsgrunner : null,
        //Validering skal fange at resultatet ikke er null
        resultat: vedtak.resultat!,
    };
};
