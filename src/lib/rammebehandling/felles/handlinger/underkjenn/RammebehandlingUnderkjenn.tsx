import { Button, Dialog, Textarea } from '@navikt/ds-react';
import { XMarkIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { useNotification } from '~/lib/_felles/notifications/NotificationContext';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';

type Props = {
    behandling: Rammebehandling;
};

export const RammebehandlingUnderkjenn = ({ behandling }: Props) => {
    const { navigateWithNotification } = useNotification();

    const [begrunnelse, setBegrunnelse] = useState('');

    const [valideringsfeil, setValideringsfeil] = useState<string | null>(null);

    const { trigger, error, isMutating } = useFetchJsonFraApi<
        Rammebehandling,
        { begrunnelse: string }
    >(`/sak/${behandling.sakId}/behandling/${behandling.id}/underkjenn`, 'POST');

    const underkjenn = () => {
        const begrunnelseTrimmed = begrunnelse.trim();

        if (begrunnelseTrimmed === '') {
            setValideringsfeil('Begrunnelse er påkrevd');
            return;
        }

        trigger({ begrunnelse: begrunnelseTrimmed }).then((response) => {
            if (response) {
                navigateWithNotification('/', 'Vedtaket har blitt underkjent!');
            }
        });
    };

    return (
        <Dialog>
            <Dialog.Trigger>
                <Button variant={'secondary'} icon={<XMarkIcon />}>
                    {'Underkjenn'}
                </Button>
            </Dialog.Trigger>

            <Dialog.Popup>
                <Dialog.Header>
                    <strong>{'Underkjenn behandlingen?'}</strong>
                </Dialog.Header>

                <Dialog.Body>
                    <Textarea
                        label={'Begrunnelse'}
                        value={begrunnelse}
                        onChange={(event) => {
                            setBegrunnelse(event.target.value);

                            if (valideringsfeil) {
                                setValideringsfeil(null);
                            }
                        }}
                        error={valideringsfeil ?? undefined}
                    />

                    {error && (
                        <Infokort
                            variant={'feil'}
                            header={'Feil ved underkjenning'}
                        >{`Feil: ${error.message} (kode ${error.status})`}</Infokort>
                    )}
                </Dialog.Body>

                <Dialog.Footer>
                    <Button
                        variant={'primary'}
                        icon={<XMarkIcon />}
                        loading={isMutating}
                        onClick={underkjenn}
                    >
                        {'Underkjenn'}
                    </Button>

                    <Dialog.CloseTrigger>
                        <Button variant={'secondary'}>{'Avbryt'}</Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};
