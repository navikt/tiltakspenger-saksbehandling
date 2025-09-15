import { Alert, Button } from '@navikt/ds-react';

import style from './OppdaterSimulering.module.css';
import { BehandlingId } from '~/types/BehandlingTypes';
import { SakId } from '~/types/SakTypes';
import { useOppdaterSimulering } from './useOppdaterSimulering';
import { MeldekortBehandlingId } from '~/types/meldekort/MeldekortBehandling';

type Props = {
    sakId: SakId;
    behandlingId: BehandlingId | MeldekortBehandlingId;
};

export const OppdaterSimuleringKnapp = ({ sakId, behandlingId }: Props) => {
    const { oppdaterSimulering, oppdaterSimuleringError } = useOppdaterSimulering(
        sakId,
        behandlingId,
    );
    return (
        <>
            <Button
                onClick={() => oppdaterSimulering()}
                variant={'secondary'}
                size={'small'}
                type={'button'}
                className={style.oppdaterSimuleringKnapp}
            >
                {'Oppdater simulering'}
            </Button>
            {oppdaterSimuleringError && (
                <Alert variant={'warning'} size="small">
                    {oppdaterSimuleringError.message}
                </Alert>
            )}
        </>
    );
};
