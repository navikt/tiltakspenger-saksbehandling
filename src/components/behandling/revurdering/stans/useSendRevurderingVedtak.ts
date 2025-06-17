import { RevurderingData, RevurderingResultat } from '../../../../types/BehandlingTypes';
import { VedtakRevurderTilStansDTO } from '../../../../types/VedtakTyper';
import { useFetchJsonFraApi } from '../../../../utils/fetch/useFetchFraApi';
import { RevurderingVedtakContext } from '../RevurderingVedtakContext';

export const useSendRevurderingVedtak = (
    behandling: RevurderingData,
    vedtak: RevurderingVedtakContext,
) => {
    const {
        trigger,
        isMutating: sendRevurderingTilBeslutningLaster,
        error: sendRevurderingTilBeslutningError,
    } = useFetchJsonFraApi<RevurderingData, VedtakRevurderTilStansDTO>(
        `/sak/${behandling.sakId}/revurdering/${behandling.id}/sendtilbeslutning`,
        'POST',
    );

    const sendRevurderingTilBeslutning = () => trigger(tilBeslutningDTO(vedtak));

    return {
        sendRevurderingTilBeslutning,
        sendRevurderingTilBeslutningLaster,
        sendRevurderingTilBeslutningError,
    };
};

const tilBeslutningDTO = (vedtak: RevurderingVedtakContext): VedtakRevurderTilStansDTO => {
    return {
        type: RevurderingResultat.STANS,
        begrunnelse: vedtak.getBegrunnelse(),
        fritekstTilVedtaksbrev: vedtak.getBrevtekst(),
        stans: {
            stansFraOgMed: vedtak.stansdato,
            valgteHjemler: vedtak.valgtHjemmelHarIkkeRettighet,
        },
    };
};
