import { Button, Dialog, Loader } from '@navikt/ds-react';
import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { useEffect } from 'react';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { SakId, SakProps } from '~/lib/sak/SakTyper';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';

type Props = {
    behandlingId: RammebehandlingId;
    sakId: SakId;
    åpen: boolean;
    onClose: () => void;
    onSuccess: (oppdatertSak: SakProps) => void;
};

/**
 * Utfører handlingen umiddelbart når åpen settes - dialogen viser en lasteanimasjon
 * mens kallet pågår, og feilen med mulighet for å prøve på nytt dersom det feiler.
 */
export const RammebehandlingAngre = ({ behandlingId, sakId, åpen, onClose, onSuccess }: Props) => {
    const { trigger, error, isMutating } = useFetchJsonFraApi<SakProps>(
        `/sak/${sakId}/behandling/${behandlingId}/angre`,
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
                            ? 'Kunne ikke angre sendingen av behandlingen til beslutning'
                            : 'Angrer sendingen av behandlingen til beslutning'}
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
                            title={'Angrer sendingen av behandlingen til beslutning'}
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
