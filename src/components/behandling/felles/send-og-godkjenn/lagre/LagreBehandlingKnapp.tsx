import { Button } from '@navikt/ds-react';
import { useLagreBehandling } from '~/components/behandling/felles/send-og-godkjenn/lagre/useLagreBehandling';
import { BehandlingVedtakDTO } from '~/types/VedtakTyper';
import { useBehandling } from '~/components/behandling/BehandlingContext';
import { BehandlingData } from '~/types/BehandlingTypes';
import { Nullable } from '~/types/UtilTypes';
import { FetcherError } from '~/utils/fetch/fetch';

type Props = {
    behandling: BehandlingData;
    hentVedtakDTO: () => Nullable<BehandlingVedtakDTO>;
    onSuccess?: () => void;
    onError?: (error: FetcherError) => void;
};

export const LagreBehandlingKnapp = ({ behandling, hentVedtakDTO, onSuccess, onError }: Props) => {
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
