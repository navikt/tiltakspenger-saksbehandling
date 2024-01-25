import { fetcher } from '../utils/http';
import { Saksbehandler } from '../types/Saksbehandler';
import useSWRImmutable from 'swr/immutable';

export default function useSaksbehandler() {
  const {
    data: saksbehandler,
    isLoading: isSaksbehandlerLoading,
    error,
  } = useSWRImmutable<Saksbehandler>('/api/saksbehandler', fetcher);

  return { saksbehandler, isSaksbehandlerLoading, error };
}
