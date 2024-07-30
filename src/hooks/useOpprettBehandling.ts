import { startBehandling } from '../utils/http';
import useSWRMutation from 'swr/mutation';
import { useRouter } from 'next/router';

export function useOpprettBehandling() {
  const router = useRouter();
  const { trigger: onOpprettBehandling, isMutating: isBehandlingMutating } = useSWRMutation(`/api/behandling/startbehandling`, startBehandling, {
    onSuccess: (behandlingId) => router.push(`/behandling/${behandlingId}/inngangsvilkar/kravfrist`),
  });

  return { onOpprettBehandling, isBehandlingMutating };
}