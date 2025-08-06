import { Button } from '@navikt/ds-react';
import { useOppdaterBehandling } from '~/components/behandling/felles/oppdater/useOppdaterBehandling';
import { BehandlingVedtakDTO } from '~/types/VedtakTyper';
import { useBehandling } from '~/components/behandling/BehandlingContext';
import { BehandlingData } from '~/types/BehandlingTypes';

type Props = {
    behandling: BehandlingData;
    hentVedtakDTO: () => BehandlingVedtakDTO;
};

export const OppdaterBehandling = ({ behandling, hentVedtakDTO }: Props) => {
    const { setBehandling } = useBehandling();
    const { oppdaterBehandling, oppdaterBehandlingLaster } = useOppdaterBehandling(behandling);

    return (
        <Button
            size={'medium'}
            variant={'secondary'}
            type={'button'}
            loading={oppdaterBehandlingLaster}
            onClick={() => {
                oppdaterBehandling(hentVedtakDTO()).then((behandling) => {
                    if (behandling) {
                        setBehandling(behandling);
                    }
                });
            }}
        >
            {'Lagre og beregn'}
        </Button>
    );
};
