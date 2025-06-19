import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { SakProps } from '~/types/SakTypes';
import { Nullable } from '~/types/common';

export type AvsluttBehandlingDTO = {
    søknadId: Nullable<string>;
    behandlingId: Nullable<string>;
    begrunnelse: string;
};

export const useAvsluttBehandling = (saksnummer: string) => {
    const {
        trigger: avsluttBehandling,
        isMutating: avsluttBehandlingIsMutating,
        error: avsluttBehandlingError,
    } = useFetchJsonFraApi<SakProps, AvsluttBehandlingDTO>(
        `sak/${saksnummer}/avbryt-aktiv-behandling`,
        'POST',
    );
    return { avsluttBehandling, avsluttBehandlingIsMutating, avsluttBehandlingError };
};
