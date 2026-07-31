import { Button, Dialog } from '@navikt/ds-react';
import { ArrowsSquarepathIcon } from '@navikt/aksel-icons';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { useSak } from '~/lib/sak/SakContext';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import {
    Rammebehandling,
    Rammebehandlingsstatus,
} from '~/lib/rammebehandling/typer/Rammebehandling';

type Props = {
    behandling: Rammebehandling;
    åpen: boolean;
    onClose: () => void;
    onSuccess: (oppdatertBehandling: Rammebehandling) => void;
};

export const RammebehandlingOverta = ({ behandling, åpen, onClose, onSuccess }: Props) => {
    const { sak } = useSak();

    const { trigger, error, isMutating } = useFetchJsonFraApi<
        Rammebehandling,
        { overtarFra: string }
    >(`/sak/${sak.sakId}/behandling/${behandling.id}/overta`, 'PATCH');

    const overtarFra =
        behandling.status === Rammebehandlingsstatus.UNDER_BESLUTNING
            ? (behandling.beslutter ?? 'Ukjent beslutter')
            : (behandling.saksbehandler ?? 'Ukjent saksbehandler');

    const overta = () => {
        trigger({ overtarFra }).then((oppdatertBehandling) => {
            if (oppdatertBehandling) {
                onSuccess(oppdatertBehandling);
            }
        });
    };

    return (
        <Dialog open={åpen} onOpenChange={(nesteÅpen) => !nesteÅpen && onClose()}>
            <Dialog.Popup>
                <Dialog.Header>
                    <strong>{'Overta behandlingen?'}</strong>
                </Dialog.Header>

                <Dialog.Body>
                    {`Er du sikker på at du vil ta over behandlingen fra ${overtarFra}?`}

                    {error && (
                        <Infokort
                            variant={'feil'}
                            header={'Feil ved overtaking'}
                        >{`Feil: ${error.message} (kode ${error.status})`}</Infokort>
                    )}
                </Dialog.Body>

                <Dialog.Footer>
                    <Button
                        variant={'primary'}
                        icon={<ArrowsSquarepathIcon aria-hidden />}
                        loading={isMutating}
                        onClick={overta}
                    >
                        {'Overta behandling'}
                    </Button>

                    <Dialog.CloseTrigger>
                        <Button variant={'secondary'}>{'Avbryt'}</Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};
