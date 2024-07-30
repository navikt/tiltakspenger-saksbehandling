import useSWRMutation from 'swr/mutation';
import { useRouter } from 'next/router';
import { mutateBehandling } from '../utils/http';

export function useOpprettBehandling() {
  const router = useRouter();
  const { trigger: onOpprettBehandling, isMutating: isBehandlingMutating } =
    useSWRMutation(`/api/behandling/tabehandling`, mutateBehandling, {
      onSuccess: (behandlingId) =>
        router.push(`/behandling/${behandlingId}/inngangsvilkar/kravfrist`),
    });

  return { onOpprettBehandling, isBehandlingMutating };
}
