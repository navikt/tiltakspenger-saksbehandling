import { Alert, Button, HStack } from '@navikt/ds-react';
import { AlleBehandlingData } from '~/types/BehandlingTypes';
import { useOppdaterSimulering } from './useOppdaterSimulering';

type Props<Behandling extends AlleBehandlingData> = {
    behandling: Behandling;
    setBehandling: (behandling: Behandling) => void;
};

export const OppdaterSimuleringKnapp = <Behandling extends AlleBehandlingData>({
    behandling,
    setBehandling,
}: Props<Behandling>) => {
    const { oppdaterSimulering, oppdaterSimuleringError, oppdaterSimuleringLaster } =
        useOppdaterSimulering(behandling);

    return (
        <HStack gap={'5'} align={'center'}>
            {oppdaterSimuleringError && (
                <Alert variant={'error'} size={'small'} inline={true}>
                    {oppdaterSimuleringError.message}
                </Alert>
            )}
            <Button
                onClick={() =>
                    oppdaterSimulering().then((oppdaterBehandling) => {
                        if (!oppdaterBehandling) {
                            return;
                        }

                        setBehandling(oppdaterBehandling);
                    })
                }
                variant={'tertiary'}
                size={'small'}
                type={'button'}
                loading={oppdaterSimuleringLaster}
            >
                {'Oppdater simulering'}
            </Button>
        </HStack>
    );
};
