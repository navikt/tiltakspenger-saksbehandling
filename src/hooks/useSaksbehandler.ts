import { fetcher } from '../utils/http';
import toast from 'react-hot-toast';
import { Saksbehandler } from '../types/Saksbehandler';
import useSWRImmutable from 'swr/immutable';

export default function useSaksbehandler() {
  const { data: saksbehandler, isLoading: isSaksbehandlerLoading } =
    useSWRImmutable<Saksbehandler>('/api/saksbehandler', fetcher, {
      onError: (error) => toast.error(`[${error.status}]: ${error.info}`),
    });

  return { saksbehandler, isSaksbehandlerLoading };
}
