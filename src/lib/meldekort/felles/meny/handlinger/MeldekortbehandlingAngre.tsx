import { SakId, SakProps } from '~/lib/sak/SakTyper';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { useEffect } from 'react';
import { Button, Dialog, Loader } from '@navikt/ds-react';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { ArrowUndoIcon } from '@navikt/aksel-icons';

type Props = {
    sakId: SakId;
    meldekortId: MeldekortbehandlingId;
    åpen: boolean;
    onClose: () => void;
    onSuccess: (oppdatertSak: SakProps) => void;
};

export const MeldekortbehandlingAngre = ({
    sakId,
    meldekortId,
    åpen,
    onClose,
    onSuccess,
}: Props) => {
    const { trigger, error, isMutating } = useFetchJsonFraApi<SakProps>(
        `/sak/${sakId}/meldekort/${meldekortId}/angre`,
        'POST',
        { onSuccess },
    );

    useEffect(() => {
        if (åpen) {
            trigger();
        }
    }, [åpen, trigger]);

    const harFeilet = error && !isMutating;

    return (
        <Dialog open={åpen} onOpenChange={(nesteÅpen) => !nesteÅpen && !isMutating && onClose()}>
            <Dialog.Popup>
                <Dialog.Header>
                    <strong>
                        {harFeilet
                            ? 'Kunne ikke angre sendingen av meldekortbehandlingen til beslutning'
                            : 'Angrer sendingen av meldekortbehandlingen til beslutning'}
                    </strong>
                </Dialog.Header>

                <Dialog.Body>
                    {harFeilet ? (
                        <Infokort
                            variant={'feil'}
                            header={'Feil ved angring'}
                        >{`Feil: ${error.message} (kode ${error.status})`}</Infokort>
                    ) : (
                        <Loader
                            size={'xlarge'}
                            title={'Angrer sendingen av meldekortbehandlingen til beslutning'}
                        />
                    )}
                </Dialog.Body>

                {harFeilet && (
                    <Dialog.Footer>
                        <Button
                            variant={'primary'}
                            icon={<ArrowUndoIcon aria-hidden />}
                            onClick={() => trigger()}
                        >
                            {'Prøv igjen'}
                        </Button>

                        <Dialog.CloseTrigger>
                            <Button variant={'secondary'}>{'Avbryt'}</Button>
                        </Dialog.CloseTrigger>
                    </Dialog.Footer>
                )}
            </Dialog.Popup>
        </Dialog>
    );
};
