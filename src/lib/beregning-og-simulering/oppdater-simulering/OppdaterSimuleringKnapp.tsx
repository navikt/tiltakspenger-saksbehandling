import { Button, HStack, InlineMessage } from '@navikt/ds-react';
import { useSak } from '~/lib/sak/SakContext';
import { BehandlingId } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { SakProps } from '~/lib/sak/SakTyper';

type Props = {
    behandlingId: BehandlingId;
    className?: string;
};

export const OppdaterSimuleringKnapp = ({ behandlingId, className }: Props) => {
    const { sak, setSak } = useSak();
    const { sakId } = sak;

    const { trigger, isMutating, error } = useFetchJsonFraApi<SakProps>(
        `/sak/${sakId}/behandling/${behandlingId}/oppdaterSimulering`,
        'POST',
    );

    return (
        <HStack gap={'space-20'} align={'center'} className={className}>
            {error && (
                <InlineMessage status={'error'} size={'small'}>
                    {error.message}
                </InlineMessage>
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
