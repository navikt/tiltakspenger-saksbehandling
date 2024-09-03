import useSWRMutation from 'swr/mutation';
import { FetcherError, mutateBehandling } from '../../utils/http';
import router from 'next/router';
import { MeldekortDager } from '../../components/meldekort/meldekortside/MeldekortSide';
import { GodkjennDTO, MeldekortDagDTO } from '../../types/MeldekortTypes';

export function useSendMeldekortTilBeslutter(meldekortId: string, meldekortDager: MeldekortDager) {
  const {
    trigger: sendMeldekortTilBeslutter,
    isMutating: senderMeldekortTilBeslutter,
    error: sendMeldekortTilBeslutterError,
  } = useSWRMutation<any, FetcherError, MeldekortDagDTO[]>(
    `/api/vedtak/meldekort/${meldekortId}/beslutter`,
    mutateBehandling,
    { onSuccess: () => router.push('/') },
  );

  return {
    sendMeldekortTilBeslutter,
    senderMeldekortTilBeslutter,
    sendMeldekortTilBeslutterError,
  };
}
