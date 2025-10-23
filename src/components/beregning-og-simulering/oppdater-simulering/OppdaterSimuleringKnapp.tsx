import { Alert, Button, HStack } from '@navikt/ds-react';

import { useOppdaterSimulering } from './useOppdaterSimulering';
import { MeldeperiodeKjedeProps } from '~/types/meldekort/Meldeperiode';
import { useSak } from '~/context/sak/SakContext';
import { BehandlingIdFelles } from '~/types/BehandlingFelles';
import { Rammebehandling } from '~/types/Behandling';

export type OppdaterSimuleringProps<BehId extends BehandlingIdFelles> = {
    behandlingId: BehId;
    oppdaterBehandlingEllerKjede: (
        behandlingEllerKjede: Rammebehandling | MeldeperiodeKjedeProps,
    ) => void;
};

export const OppdaterSimuleringKnapp = <BehId extends BehandlingIdFelles>({
    behandlingId,
    oppdaterBehandlingEllerKjede,
}: OppdaterSimuleringProps<BehId>) => {
    const { sakId } = useSak().sak;

    const { oppdaterSimulering, oppdaterSimuleringError, oppdaterSimuleringLaster } =
        useOppdaterSimulering(sakId, behandlingId);

    return (
        <HStack gap={'5'} align={'center'}>
            {oppdaterSimuleringError && (
                <Alert variant={'error'} size={'small'} inline={true}>
                    {oppdaterSimuleringError.message}
                </Alert>
            )}
            <Button
                onClick={() =>
                    oppdaterSimulering().then((oppdatertBehandlingEllerKjede) => {
                        if (!oppdatertBehandlingEllerKjede) {
                            return;
                        }

                        oppdaterBehandlingEllerKjede(oppdatertBehandlingEllerKjede);
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
