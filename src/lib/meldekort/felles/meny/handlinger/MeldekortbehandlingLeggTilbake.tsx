import { Button, Dialog } from '@navikt/ds-react';
import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { SakProps } from '~/lib/sak/SakTyper';
import { useSak } from '~/lib/sak/SakContext';
import { Infokort } from '~/lib/_felles/infokort/Infokort';

import { MeldekortbehandlingProps } from '~/lib/meldekort/typer/Meldekortbehandling';

type Props = {
    meldekortbehandling: MeldekortbehandlingProps;
    åpen: boolean;
    onClose: () => void;
    onSuccess: (oppdatertSak: SakProps) => void;
};

export const MeldekortbehandlingLeggTilbake = ({
    meldekortbehandling,
    åpen,
    onClose,
    onSuccess,
}: Props) => {
    const { sak } = useSak();
    const { id } = meldekortbehandling;

    const { trigger, error, isMutating } = useFetchJsonFraApi<SakProps>(
        `/sak/${sak.sakId}/meldekort/${id}/legg-tilbake`,
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
                    <strong>{'Legg tilbake meldekortbehandlingen?'}</strong>
                </Dialog.Header>

                <Dialog.Body>
                    {'Er du sikker på at du vil legge tilbake meldekortbehandlingen?'}

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
