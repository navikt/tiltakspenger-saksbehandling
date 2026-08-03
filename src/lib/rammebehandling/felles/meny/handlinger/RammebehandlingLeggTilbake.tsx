import { Button, Dialog } from '@navikt/ds-react';
import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { useSak } from '~/lib/sak/SakContext';
import { SakProps } from '~/lib/sak/SakTyper';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';

type Props = {
    behandling: Rammebehandling;
    åpen: boolean;
    onClose: () => void;
    onSuccess: (oppdatertSak: SakProps) => void;
};

export const RammebehandlingLeggTilbake = ({ behandling, åpen, onClose, onSuccess }: Props) => {
    const { sak } = useSak();
    const { id } = behandling;

    const { trigger, error, isMutating } = useFetchJsonFraApi<SakProps>(
        `/sak/${sak.sakId}/behandling/${id}/legg-tilbake`,
        'POST',
    );

    const leggTilbake = () => {
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
                    <strong>{'Legg tilbake behandlingen?'}</strong>
                </Dialog.Header>

                <Dialog.Body>
                    {'Er du sikker på at du vil legge tilbake behandlingen?'}

                    {error && (
                        <Infokort
                            variant={'feil'}
                            header={'Feil ved å legge tilbake'}
                        >{`Feil: ${error.message} (kode ${error.status})`}</Infokort>
                    )}
                </Dialog.Body>

                <Dialog.Footer>
                    <Button
                        variant={'primary'}
                        icon={<ArrowUndoIcon aria-hidden />}
                        loading={isMutating}
                        onClick={leggTilbake}
                    >
                        {'Legg tilbake'}
                    </Button>

                    <Dialog.CloseTrigger>
                        <Button variant={'secondary'}>{'Avbryt'}</Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};
