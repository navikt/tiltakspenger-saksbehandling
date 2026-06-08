import { Alert, Button, HStack } from '@navikt/ds-react';
import { useOppdaterSimulering } from './useOppdaterSimulering';
import { MeldeperiodeKjedeProps } from '~/lib/meldekort/typer/Meldeperiode';
import { useSak } from '~/lib/sak/SakContext';
import { BehandlingId } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { RammebehandlingId, Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';

export type OppdaterSimuleringProps<BehId extends BehandlingId> = {
    behandlingId: BehId;
    oppdaterBehandlingEllerKjede: (
        behandlingEllerKjede: BehId extends RammebehandlingId
            ? Rammebehandling
            : MeldeperiodeKjedeProps,
    ) => void;
};

export const OppdaterSimuleringKnapp = <BehId extends BehandlingId>({
    behandlingId,
    oppdaterBehandlingEllerKjede,
}: OppdaterSimuleringProps<BehId>) => {
    const { sakId } = useSak().sak;

    const { oppdaterSimulering, oppdaterSimuleringError, oppdaterSimuleringLaster } =
        useOppdaterSimulering(sakId, behandlingId);

    return (
        <HStack gap={'space-20'} align={'center'}>
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
                variant={'secondary'}
                size={'small'}
                type={'button'}
                loading={oppdaterSimuleringLaster}
            >
                {'Oppdater simulering'}
            </Button>
        </HStack>
    );
};
