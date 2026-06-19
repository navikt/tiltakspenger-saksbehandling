import { Attestering } from '~/lib/behandling-felles/typer/Attestering';
import { Button, Dialog } from '@navikt/ds-react';
import OppsummeringAvAttesteringer from '~/lib/behandling-felles/attestering/OppsummeringAvAttestering';

type Props = {
    attesteringer: Attestering[];
    åpen: boolean;
    onClose: () => void;
};

export const OppsummeringAvAttesteringerModal = ({ attesteringer, åpen, onClose }: Props) => {
    return (
        <Dialog open={åpen} onOpenChange={(nesteÅpen) => !nesteÅpen && onClose()}>
            <Dialog.Popup>
                <Dialog.Body>
                    <OppsummeringAvAttesteringer attesteringer={attesteringer} />
                </Dialog.Body>

                <Dialog.Footer>
                    <Dialog.CloseTrigger>
                        <Button variant={'secondary'}>{'Lukk'}</Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};
