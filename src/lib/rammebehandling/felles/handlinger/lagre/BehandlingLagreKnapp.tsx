import { Button } from '@navikt/ds-react';
import { useBehandling } from '~/lib/rammebehandling/context/BehandlingContext';
import { Nullable } from '~/types/UtilTypes';
import { FetcherError } from '~/utils/fetch/fetch';
import {
    Rammebehandling,
    OppdaterBehandlingDTO,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

type Props = {
    behandling: Rammebehandling;
    hentVedtakDTO: () => Nullable<OppdaterBehandlingDTO>;
    onSuccess?: () => void;
    onError?: (error: FetcherError) => void;
};

export const BehandlingLagreKnapp = ({ behandling, hentVedtakDTO, onSuccess, onError }: Props) => {
    const { setBehandling } = useBehandling();
    const { trigger, isMutating } = useFetchJsonFraApi<Rammebehandling, OppdaterBehandlingDTO>(
        `/sak/${behandling.sakId}/behandling/${behandling.id}/oppdater`,
        'POST',
        {
            onSuccess,
            onError,
        },
    );

    return (
        <Button
            size={'medium'}
            variant={'secondary'}
            type={'button'}
            loading={isMutating}
            onClick={() => {
                const vedtakDto = hentVedtakDTO();

                if (!vedtakDto) {
                    return;
                }

                trigger(vedtakDto).then((behandling) => {
                    if (behandling) {
                        setBehandling(behandling);
                    }
                });
            }}
        >
            {'Lagre'}
        </Button>
    );
};
