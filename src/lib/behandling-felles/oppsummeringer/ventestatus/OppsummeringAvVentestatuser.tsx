import { VentestatusHendelse } from '~/types/Ventestatus';
import OppsummeringAvVentestatus from './OppsummeringAvVentestatus';
import { Button, Dialog, Heading } from '@navikt/ds-react';
import { useState } from 'react';
import { Separator } from '~/lib/_felles/separator/Separator';

type Props = {
    ventestatuser: VentestatusHendelse[];
};

export const OppsummeringAvVentestatuser = ({ ventestatuser }: Props) => {
    const [åpen, setÅpen] = useState(false);

    return (
        <div>
            <Button
                type={'button'}
                size={'small'}
                variant={'tertiary'}
                onClick={() => setÅpen(true)}
            >
                {'Se ventestatus-historikk'}
            </Button>

            <OppsummeringAvVentestatuserModal
                ventestatuser={ventestatuser}
                åpen={åpen}
                onClose={() => setÅpen(false)}
            />
        </div>
    );
};

type ModalProps = {
    ventestatuser: VentestatusHendelse[];
    åpen: boolean;
    onClose: () => void;
};

export const OppsummeringAvVentestatuserModal = ({ ventestatuser, åpen, onClose }: ModalProps) => {
    return (
        <Dialog
            open={åpen}
            onOpenChange={(skalÅpne) => {
                if (!skalÅpne) {
                    onClose();
                }
            }}
        >
            <Dialog.Popup>
                <Dialog.Header>
                    <Heading size={'medium'} level={'2'}>
                        {'Ventestatus - historikk'}
                    </Heading>
                </Dialog.Header>
                <Dialog.Body>
                    <ul>
                        {ventestatuser.map((ventestatus) => (
                            <ol key={ventestatus.tidspunkt}>
                                <OppsummeringAvVentestatus
                                    ventestatus={ventestatus}
                                    size={'small'}
                                />
                                <Separator />
                            </ol>
                        ))}
                    </ul>
                </Dialog.Body>
                <Dialog.Footer>
                    <Dialog.CloseTrigger>
                        <Button type={'button'} variant={'secondary'}>
                            {'Lukk'}
                        </Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};
