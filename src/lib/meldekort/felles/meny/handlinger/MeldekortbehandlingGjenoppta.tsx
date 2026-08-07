import { Button, Dialog } from '@navikt/ds-react';
import { PlayIcon } from '@navikt/aksel-icons';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { SakId, SakProps } from '~/lib/sak/SakTyper';

import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';

type Props = {
    meldekortId: MeldekortbehandlingId;
    sakId: SakId;
    åpen: boolean;
    onClose: () => void;
    onSuccess: (oppdatertSak: SakProps) => void;
};

export const MeldekortbehandlingGjenoppta = ({
    meldekortId,
    sakId,
    åpen,
    onClose,
    onSuccess,
}: Props) => {
    const { trigger, error, isMutating } = useFetchJsonFraApi<SakProps>(
        `/sak/${sakId}/meldekort/${meldekortId}/gjenoppta`,
        'PATCH',
    );

    const gjenoppta = () => {
        trigger().then((oppdatertSak) => {
            if (oppdatertSak) {
                onSuccess(oppdatertSak);
            }
        });
    };

    return (
        <Dialog open={åpen} onOpenChange={(nesteÅpen) => !nesteÅpen && onClose()}>
            <Dialog.Popup>
                <Dialog.Header>
                    <strong>{'Gjenoppta meldekortbehandlingen?'}</strong>
                </Dialog.Header>

                <Dialog.Body>
                    {'Er du sikker på at du vil gjenoppta meldekortbehandlingen?'}

                    {error && (
                        <Infokort
                            variant={'feil'}
                            header={'Feil ved gjenopptak'}
                        >{`Feil: ${error.message} (kode ${error.status})`}</Infokort>
                    )}
                </Dialog.Body>

                <Dialog.Footer>
                    <Button
                        variant={'primary'}
                        icon={<PlayIcon aria-hidden />}
                        loading={isMutating}
                        onClick={gjenoppta}
                    >
                        {'Gjenoppta'}
                    </Button>

                    <Dialog.CloseTrigger>
                        <Button variant={'secondary'}>{'Avbryt'}</Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};
