import { Button, Dialog, Loader } from '@navikt/ds-react';
import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { useEffect } from 'react';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { SakId, SakProps } from '~/lib/sak/SakTyper';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
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
export const RammebehandlingLeggTilbake = ({
    behandlingId,
    sakId,
    åpen,
    onClose,
    onSuccess,
}: Props) => {
    const { trigger, error, isMutating } = useFetchJsonFraApi<SakProps>(
        `/sak/${sakId}/behandling/${behandlingId}/legg-tilbake`,
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
                            ? 'Kunne ikke legge tilbake behandlingen'
                            : 'Legger tilbake behandlingen'}
                    </strong>
                </Dialog.Header>

                <Dialog.Body>
                    {harFeilet ? (
                        <Infokort
                            variant={'feil'}
                            header={'Feil ved å legge tilbake'}
                        >{`Feil: ${error.message} (kode ${error.status})`}</Infokort>
                    ) : (
                        <Loader size={'xlarge'} title={'Legger tilbake behandlingen'} />
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
