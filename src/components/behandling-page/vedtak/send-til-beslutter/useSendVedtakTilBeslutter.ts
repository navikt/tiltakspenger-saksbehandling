import { useBehandling } from '../../../../context/behandling/BehandlingContext';
import {
    VedtakData,
    VedtakMedResultat,
    VedtakTilBeslutterDTO,
} from '../../../../types/VedtakTyper';
import { BehandlingData } from '../../../../types/BehandlingTypes';
import useSWRMutation from 'swr/mutation';
import { FetcherError, throwErrorIfFatal } from '../../../../utils/http';

export const useSendVedtakTilBeslutter = () => {
    const { vedtak, behandling } = useBehandling();

    const { trigger, isMutating, error } = useSWRMutation<
        BehandlingData,
        FetcherError,
        string,
        VedtakTilBeslutterDTO
    >(
        `/api/sak/${behandling.sakId}/behandling/${behandling.id}/sendtilbeslutter`,
        fetchSendTilBeslutter,
        { throwOnError: false },
    );

    const sendTilBeslutter = () => trigger(tilBeslutterDTO(vedtak as VedtakMedResultat));

    return {
        sendTilBeslutter,
        isLoading: isMutating,
        error,
    };
};

const fetchSendTilBeslutter = async (url: string, { arg }: { arg: VedtakTilBeslutterDTO }) => {
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg),
    });
    await throwErrorIfFatal(res);
    return res.json();
};

const tilBeslutterDTO = (vedtak: VedtakMedResultat): VedtakTilBeslutterDTO => {
    return {
        begrunnelseVilkårsvurdering: vedtak.begrunnelseVilkårsvurdering,
        fritekstTilVedtaksbrev: vedtak.fritekstTilVedtaksbrev,
        innvilgelsesperiode: vedtak.innvilgelsesPeriode,
    };
};

const validerVedtak = (vedtak: VedtakData) => {
    const errors: string[] = [];

    if (!vedtak.resultat) {
        errors.push('Mangler innvilgelse eller avslag');
    }

    if (!vedtak.begrunnelseVilkårsvurdering) {
        errors.push('Mangler begrunnelse for vedtak');
    }

    if (!vedtak.fritekstTilVedtaksbrev) {
        errors.push('Mangler tekst til vedtaksbrev');
    }
};
