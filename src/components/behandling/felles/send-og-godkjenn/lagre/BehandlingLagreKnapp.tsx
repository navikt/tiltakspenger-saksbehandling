import { Button } from '@navikt/ds-react';
import { useLagreBehandling } from '~/components/behandling/felles/send-og-godkjenn/lagre/useLagreBehandling';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';

import { Nullable } from '~/types/UtilTypes';
import { FetcherError } from '~/utils/fetch/fetch';
import { Rammebehandling, RammebehandlingVedtakRequest } from '~/types/Rammebehandling';

type Props = {
    behandling: Rammebehandling;
    hentVedtakDTO: () => Nullable<RammebehandlingVedtakRequest>;
    onSuccess?: () => void;
    onError?: (error: FetcherError) => void;
};

export const BehandlingLagreKnapp = ({ behandling, hentVedtakDTO, onSuccess, onError }: Props) => {
    const { setBehandling } = useBehandling();
    const { lagreBehandling, lagreBehandlingLaster } = useLagreBehandling({
        behandling,
        options: {
            onSuccess,
            onError,
        },
    });

    return (
        <Button
            size={'medium'}
            variant={'secondary'}
            type={'button'}
            loading={lagreBehandlingLaster}
            onClick={() => {
                const vedtakDto = hentVedtakDTO();

                if (!vedtakDto) {
                    return;
                }

                lagreBehandling(vedtakDto).then((behandling) => {
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
