import { FetcherError, fetchSøker } from '../utils/http';
import useSWRMutation from 'swr/mutation';
import { useRouter } from 'next/router';
import { SøkerIdent, SøkerResponse } from '../types/Søker';

function useSokOppPerson(navigateToSoker: boolean = true) {
  const router = useRouter();
  const { trigger, isMutating: isSokerMutating } = useSWRMutation<
    SøkerResponse,
    FetcherError,
    '/api/soker',
    SøkerIdent
  >('/api/soker', fetchSøker, {
    onSuccess: (data) => navigateToSoker && router.push(`/saker/${data.id}`),
  });

  return { trigger, isSokerMutating };
}

export default useSokOppPerson;
