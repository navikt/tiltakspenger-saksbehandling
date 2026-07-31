import { Button, Dialog } from '@navikt/ds-react';
import { PersonIcon } from '@navikt/aksel-icons';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { useSak } from '~/lib/sak/SakContext';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';

type Props = {
    behandling: Rammebehandling;
    åpen: boolean;
    onClose: () => void;
    onSuccess: (oppdatertBehandling: Rammebehandling) => void;
};

export const RammebehandlingTildelMeg = ({ behandling, åpen, onClose, onSuccess }: Props) => {
    const { sak } = useSak();
    const { id } = behandling;

    const { trigger, error, isMutating } = useFetchJsonFraApi<Rammebehandling>(
        `/sak/${sak.sakId}/behandling/${id}/ta`,
        'POST',
    );

    const tildelMeg = () => {
        trigger().then((oppdatertBehandling) => {
            if (oppdatertBehandling) {
                onSuccess(oppdatertBehandling);
            }
        });
    };

    return (
        <Dialog open={åpen} onOpenChange={(nesteÅpen) => !nesteÅpen && onClose()}>
            <Dialog.Popup>
                <Dialog.Header>
                    <strong>{'Tildel deg behandlingen?'}</strong>
                </Dialog.Header>

                <Dialog.Body>
                    {'Er du sikker på at du vil tildele deg behandlingen?'}

                    {error && (
                        <Infokort
                            variant={'feil'}
                            header={'Feil ved tildeling'}
                        >{`Feil: ${error.message} (kode ${error.status})`}</Infokort>
                    )}
                </Dialog.Body>

                <Dialog.Footer>
                    <Button
                        variant={'primary'}
                        icon={<PersonIcon aria-hidden />}
                        loading={isMutating}
                        onClick={tildelMeg}
                    >
                        {'Tildel meg'}
                    </Button>

                    <Dialog.CloseTrigger>
                        <Button variant={'secondary'}>{'Avbryt'}</Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};
