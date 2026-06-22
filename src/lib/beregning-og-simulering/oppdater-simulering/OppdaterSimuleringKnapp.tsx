import { Alert, Button, HStack } from '@navikt/ds-react';
import { useSak } from '~/lib/sak/SakContext';
import { BehandlingId } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { SakProps } from '~/lib/sak/SakTyper';

type Props = {
    behandlingId: BehandlingId;
};

export const OppdaterSimuleringKnapp = ({ behandlingId }: Props) => {
    const { sak, setSak } = useSak();
    const { sakId } = sak;

    const { trigger, isMutating, error } = useFetchJsonFraApi<SakProps>(
        `/sak/${sakId}/behandling/${behandlingId}/oppdaterSimulering`,
        'POST',
    );

    return (
        <HStack gap={'space-20'} align={'center'}>
            {error && (
                <Alert variant={'error'} size={'small'} inline={true}>
                    {error.message}
                </Alert>
            )}
            <Button
                onClick={() =>
                    trigger().then((oppdatertSak) => {
                        if (oppdatertSak) {
                            setSak(oppdatertSak);
                        }
                    })
                }
                variant={'secondary'}
                size={'small'}
                type={'button'}
                loading={isMutating}
            >
                {'Oppdater simulering'}
            </Button>
        </HStack>
    );
};
