import { SakId } from '~/types/Sak';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { Nullable } from '~/types/UtilTypes';
import { BehandlingId, Rammebehandling } from '~/types/Rammebehandling';

export type SettBehandlingPåVentDTO = {
    sakId: Nullable<string>;
    behandlingId: Nullable<string>;
    begrunnelse: string;
    frist: Nullable<string>;
};

export const useSettBehandlingPåVent = (sakId: SakId, behandlingId: BehandlingId) => {
    const {
        trigger: settBehandlingPåVent,
        isMutating: isSettBehandlingPåVentMutating,
        error: settBehandlingPåVentError,
    } = useFetchJsonFraApi<Rammebehandling, SettBehandlingPåVentDTO>(
        `/sak/${sakId}/behandling/${behandlingId}/pause`,
        'POST',
    );

    return { settBehandlingPåVent, isSettBehandlingPåVentMutating, settBehandlingPåVentError };
};
