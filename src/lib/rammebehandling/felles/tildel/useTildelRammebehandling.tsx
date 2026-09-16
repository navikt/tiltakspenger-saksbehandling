import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { SakId, SakProps } from '~/lib/sak/SakTyper';

export const useTildelRammebehandling = () => {
    return useFetchJsonFraApi<ResponseBody, RequestBody>('/behandlinger/ta', 'POST');
};

type RequestBody = {
    behandlinger: Array<{
        behandlingId: RammebehandlingId;
        sakId: SakId;
    }>;
    returnerSaker: boolean;
};

type ResponseBody = {
    behandlinger: Array<{
        behandlingId: RammebehandlingId;
        saksnummer: string;
    }>;
    saker: SakProps[];
};
