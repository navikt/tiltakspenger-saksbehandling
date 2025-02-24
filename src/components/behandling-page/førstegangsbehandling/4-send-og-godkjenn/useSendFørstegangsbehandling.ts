import {
    VedtakData,
    VedtakMedResultat,
    VedtakTilBeslutterDTO,
} from '../../../../types/VedtakTyper';
import { BehandlingData } from '../../../../types/BehandlingTypes';
import useSWRMutation from 'swr/mutation';

import { FetcherError, throwErrorIfFatal } from '../../../../utils/client-fetch';

export const useSendFørstegangsbehandling = (vedtak: VedtakData, behandling: BehandlingData) => {
    const { trigger, isMutating, error } = useSWRMutation<
        BehandlingData,
        FetcherError,
        string,
        VedtakTilBeslutterDTO
    >(
        `/api/sak/${behandling.sakId}/behandling/${behandling.id}/sendtilbeslutning`,
        fetchSendTilBeslutter,
    );

    const sendTilBeslutter = () => trigger(tilBeslutterDTO(vedtak as VedtakMedResultat));

    return {
        sendTilBeslutter,
        sendTilBeslutterLaster: isMutating,
        sendTilBeslutterError: error,
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
