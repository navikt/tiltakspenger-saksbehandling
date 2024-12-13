import useSWRMutation from 'swr/mutation';
import { FetcherError, mutateBehandling } from '../utils/http';
import router from 'next/router';
import { mutate } from 'swr';
import { Behandling, TypeBehandling } from '../types/BehandlingTypes';

export const finnOversiktslenke = (sakId: string, type: TypeBehandling) => {
  switch (type) {
    case TypeBehandling.FØRSTEGANGSBEHANDLING:
    case TypeBehandling.SØKNAD:
      return `/`;
    case TypeBehandling.REVURDERING:
      return `/sak/${sakId}`;
    default:
      return '/';
  }
};

export function useSendTilBeslutter(behandlingId: string) {
  const {
    trigger: sendTilBeslutter,
    isMutating: senderTilBeslutter,
    error: sendTilBeslutterError,
  } = useSWRMutation<Behandling, FetcherError, any>(
    `/api/behandling/beslutter/${behandlingId}`,
    mutateBehandling,
    {
      onSuccess: (data) => {
        mutate(`/api/behandlinger`);
        mutate(`/api/behandling/${behandlingId}`);
        router.push(finnOversiktslenke(data.saksnummer, data.behandlingstype));
      },
    },
  );

  return { sendTilBeslutter, senderTilBeslutter, sendTilBeslutterError };
}
