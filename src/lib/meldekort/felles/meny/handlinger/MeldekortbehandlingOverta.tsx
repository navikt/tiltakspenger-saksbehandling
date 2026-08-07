import { Button, Dialog } from '@navikt/ds-react';
import { ArrowsSquarepathIcon } from '@navikt/aksel-icons';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { SakId, SakProps } from '~/lib/sak/SakTyper';

import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';

type Props = {
    meldekortId: MeldekortbehandlingId;
    /** NavIdenten til saksbehandleren/beslutteren som overtas fra */
    overtarFra: string;
    sakId: SakId;
    åpen: boolean;
    onClose: () => void;
    onSuccess: (oppdatertSak: SakProps) => void;
};

export const MeldekortbehandlingOverta = ({
    meldekortId,
    overtarFra,
    sakId,
    åpen,
    onClose,
    onSuccess,
}: Props) => {
    const { trigger, error, isMutating } = useFetchJsonFraApi<SakProps, { overtarFra: string }>(
        `/sak/${sakId}/meldekort/${meldekortId}/overta`,
        'PATCH',
    );

    const overta = () => {
        trigger({ overtarFra }).then((oppdatertSak) => {
            if (oppdatertSak) {
                onSuccess(oppdatertSak);
            }
        });
    };

    return (
        <Dialog open={åpen} onOpenChange={(nesteÅpen) => !nesteÅpen && onClose()}>
            <Dialog.Popup>
                <Dialog.Header>
                    <strong>{'Overta meldekortbehandlingen?'}</strong>
                </Dialog.Header>

                <Dialog.Body>
                    {`Er du sikker på at du vil ta over meldekortbehandlingen fra ${overtarFra}?`}

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
