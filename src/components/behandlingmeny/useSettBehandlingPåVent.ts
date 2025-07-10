import { BehandlingData, BehandlingId } from '~/types/BehandlingTypes';
import { SakId } from '~/types/SakTypes';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { Nullable } from '~/types/UtilTypes';

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
    } = useFetchJsonFraApi<BehandlingData, SettBehandlingPåVentDTO>(
        `/sak/${sakId}/behandling/${behandlingId}/pause`,
        'POST',
    );

    return { settBehandlingPåVent, isSettBehandlingPåVentMutating, settBehandlingPåVentError };
};
