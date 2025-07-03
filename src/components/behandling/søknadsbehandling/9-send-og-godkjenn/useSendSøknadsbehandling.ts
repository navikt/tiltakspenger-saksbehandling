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
    switch (vedtak.resultat) {
        case SøknadsbehandlingResultat.INNVILGELSE:
            return {
                begrunnelseVilkårsvurdering: vedtak.getBegrunnelse(),
                fritekstTilVedtaksbrev: vedtak.getBrevtekst(),
                innvilgelsesperiode: vedtak.behandlingsperiode,
                barnetillegg: vedtak.harBarnetillegg
                    ? {
                          begrunnelse: vedtak.getBarnetilleggBegrunnelse(),
                          perioder: vedtak.barnetilleggPerioder,
                      }
                    : null,
                valgteTiltaksdeltakelser: vedtak.valgteTiltaksdeltakelser,
                antallDagerPerMeldeperiodeForPerioder: vedtak.antallDagerPerMeldeperiode.map(
                    (dager) => ({
                        antallDagerPerMeldeperiode: dager.antallDagerPerMeldeperiode!,
                        periode: {
                            fraOgMed: dager.periode.fraOgMed!,
                            tilOgMed: dager.periode.tilOgMed!,
                        },
                    }),
                ),
                resultat: vedtak.resultat,
            };
        case SøknadsbehandlingResultat.AVSLAG:
            return {
                avslagsgrunner: vedtak.avslagsgrunner!,
                begrunnelseVilkårsvurdering: vedtak.getBegrunnelse(),
                fritekstTilVedtaksbrev: vedtak.getBrevtekst(),
                valgteTiltaksdeltakelser: vedtak.valgteTiltaksdeltakelser,
                resultat: vedtak.resultat,
            };
    }

    throw new Error('Ugyldig resultat for søknadsbehandling vedtak');
};
