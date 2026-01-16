import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { SakProps } from '~/types/Sak';
import { SøknadId } from '~/types/Søknad';
import { BehandlingId } from '~/types/Rammebehandling';

export type SøknadIdEllerBehandlingId =
    | { søknadId: SøknadId; behandlingId?: never }
    | { behandlingId: BehandlingId; søknadId?: never };

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
