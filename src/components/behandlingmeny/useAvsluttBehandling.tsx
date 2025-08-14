import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { SakProps } from '~/types/SakTypes';
import { SøknadIdEllerBehandlingId } from '~/components/saksoversikt/avsluttBehandling/AvsluttBehandlingProps';

type AvsluttBehandlingDTO = {
    begrunnelse: string;
} & SøknadIdEllerBehandlingId;

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
