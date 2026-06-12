import { Button, Dialog, Switch, VStack } from '@navikt/ds-react';
import { CalendarIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { useSak } from '~/lib/sak/SakContext';
import { SakProps } from '~/lib/sak/SakTyper';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

export const MeldekortHelgToggle = () => {
    const { sak, setSak } = useSak();
    const { kanSendeInnHelgForMeldekort } = sak;

    const [åpen, setÅpen] = useState(false);

    const { trigger, error, isMutating } = useFetchJsonFraApi<SakProps, { kanSendeHelg: boolean }>(
        `/sak/${sak.sakId}/toggle-helg-meldekort`,
        'POST',
    );

    return (
        <>
            <Button
                variant={'tertiary'}
                size={'small'}
                icon={<CalendarIcon aria-hidden />}
                onClick={() => setÅpen(true)}
            >
                {`Innstilling for meldekort helg (${kanSendeInnHelgForMeldekort ? 'på' : 'av'})`}
            </Button>

            <Dialog open={åpen} onOpenChange={(nesteÅpen) => !nesteÅpen && setÅpen(false)}>
                <Dialog.Popup>
                    <Dialog.Header>
                        <strong>{'Innstilling for meldekort helg'}</strong>
                    </Dialog.Header>

                    <Dialog.Body>
                        <VStack gap={'space-8'}>
                            <Switch
                                checked={kanSendeInnHelgForMeldekort}
                                onChange={(e) =>
                                    trigger({
                                        kanSendeHelg: e.target.checked,
                                    }).then((oppdatertSak) => {
                                        if (oppdatertSak) {
                                            setSak(oppdatertSak);
                                        }
                                    })
                                }
                                loading={isMutating}
                            >
                                {`Skru ${kanSendeInnHelgForMeldekort ? 'av' : 'på'} meldekort helg`}
                            </Switch>
                            {error && <Infokort variant={'feil'}>{error?.message}</Infokort>}
                        </VStack>
                    </Dialog.Body>

                    <Dialog.Footer>
                        <Dialog.CloseTrigger>
                            <Button variant={'secondary'}>{'Lukk'}</Button>
                        </Dialog.CloseTrigger>
                    </Dialog.Footer>
                </Dialog.Popup>
            </Dialog>
        </>
    );
};
