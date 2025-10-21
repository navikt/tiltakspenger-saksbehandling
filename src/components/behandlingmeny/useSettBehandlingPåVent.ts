import { SakId } from '~/types/Sak';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { Nullable } from '~/types/UtilTypes';
import { Behandling, BehandlingId } from '~/types/Behandling';

export type SettBehandlingPåVentDTO = {
    sakId: Nullable<string>;
    behandlingId: Nullable<string>;
    begrunnelse: string;
};

export const useSettBehandlingPåVent = (sakId: SakId, behandlingId: BehandlingId) => {
    const {
        trigger: settBehandlingPåVent,
        isMutating: isSettBehandlingPåVentMutating,
        error: settBehandlingPåVentError,
    } = useFetchJsonFraApi<Behandling, SettBehandlingPåVentDTO>(
        `/sak/${sakId}/behandling/${behandlingId}/pause`,
        'POST',
    );

    return { settBehandlingPåVent, isSettBehandlingPåVentMutating, settBehandlingPåVentError };
};
