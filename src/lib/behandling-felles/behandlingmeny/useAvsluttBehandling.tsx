import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { SakProps } from '~/lib/sak/SakTyper';
import { BehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';

type AvsluttBehandlingDTO = {
    begrunnelse: string;
    behandlingId: BehandlingId;
};

export const useAvsluttBehandling = (saksnummer: string, onSuccess: (sak: SakProps) => void) => {
    const {
        trigger: avsluttBehandling,
        isMutating: avsluttBehandlingIsMutating,
        error: avsluttBehandlingError,
    } = useFetchJsonFraApi<SakProps, AvsluttBehandlingDTO>(
        `sak/${saksnummer}/avbryt-aktiv-behandling`,
        'POST',
        { onSuccess: onSuccess },
    );

    return { avsluttBehandling, avsluttBehandlingIsMutating, avsluttBehandlingError };
};
