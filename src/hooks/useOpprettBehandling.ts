import { startBehandling } from '../utils/http';
import useSWRMutation from 'swr/mutation';
import { useRouter } from 'next/router';

function useOpprettBehandling(søknadId: string) {
  const router = useRouter();
  const { trigger, isMutating: isSokerMutating } = useSWRMutation(`/api/behandling/startbehandling/${søknadId}`, startBehandling, {
    onSuccess: (data) => router.push(`/behandling/${data.}/inngangsvilkar/kravfrist`),
  });


  async function oppdaterBehandling(url: string, { arg }: { arg?: string }) {
    await fetch(url, {
      method: 'POST',
    }).then(() => mutator(`/api/behandling/${behandlingId}`));
  }

  const { trigger: godkjennBehandling, isMutating: godkjennerBehandling } =
    useSWRMutation(
      `/api/behandling/godkjenn/${behandlingId}`,
      oppdaterBehandling,
    );

  return { trigger, isSokerMutating };
}

export default useOpprettBehandling;
