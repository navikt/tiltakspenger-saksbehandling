import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Behandling } from '../types/Behandling';
import Søker, { SøkerResponse } from '../types/Søker';
import { fetcher, FetcherError, fetchSøker } from '../utils/http';
import toast from 'react-hot-toast';
import { Saksbehandler } from '../types/Saksbehandler';
import useSWRMutation from 'swr/mutation';
import { useRouter } from 'next/router';

function useSokOppPerson(navigateToSoker: boolean = true) {
    const router = useRouter();
    const { trigger, isMutating: isSokerMutating } = useSWRMutation<SøkerResponse>('/api/soker', fetchSøker, {
        onSuccess: (data) => navigateToSoker && router.push(`/soker/${data.id}`),
        onError: (error: FetcherError) => toast.error(`[${error.status}] ${error.info}`),
    });

    return { trigger, isSokerMutating };
}

export default useSokOppPerson;
