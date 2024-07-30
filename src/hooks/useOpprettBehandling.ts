import { mutateBehandling } from '../utils/http';
import useSWRMutation from 'swr/mutation';
import { useRouter } from 'next/router';

export function useOpprettBehandling() {
  const router = useRouter();
  const { trigger: onOpprettBehandling, isMutating: isBehandlingMutating } =
    useSWRMutation(`/api/behandling/startbehandling`, mutateBehandling, {
      onSuccess: (behandlingId) =>
        router.push(`/behandling/${behandlingId}/inngangsvilkar/kravfrist`),
    });

  return { onOpprettBehandling, isBehandlingMutating };
}
