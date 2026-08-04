import { Button, Dialog } from '@navikt/ds-react';
import { ArrowRightIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { useBehandling } from '../../../context/BehandlingContext';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { useNotification } from '~/lib/_felles/notifications/NotificationContext';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { ValideringResultat } from '~/lib/rammebehandling/typer/Validering';
import { BehandlingValideringVarsler } from '~/lib/rammebehandling/felles/handlinger/varsler/BehandlingValideringVarsler';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { FetcherError } from '~/utils/fetch/fetch';

type Props = {
    behandling: Rammebehandling;
    valider: () => boolean;
    valideringResultat: ValideringResultat;
    disabled: boolean;
};

export const RammebehandlingSendTilBeslutning = ({
    behandling,
    valider,
    valideringResultat,
    disabled,
}: Props) => {
    const { navigateWithNotification } = useNotification();
    const { setBehandling } = useBehandling();

    const [åpen, setÅpen] = useState(false);

    const { trigger, isMutating, error, reset } = useFetchJsonFraApi<
        Rammebehandling,
        undefined,
        FetcherError<Rammebehandling>
    >(`/sak/${behandling.sakId}/behandling/${behandling.id}/sendtilbeslutning`, 'POST');

    const sendTilBeslutning = () => {
        trigger().then((oppdatertBehandling) => {
            if (oppdatertBehandling) {
                setBehandling(oppdatertBehandling);
                setÅpen(false);
                navigateWithNotification('/', 'Vedtaket er sendt til beslutning!');
            } else if (error?.data) {
                setBehandling(error.data);
            }
        });
    };

    return (
        <>
            <Button
                variant={'primary'}
                icon={<ArrowRightIcon />}
                disabled={disabled}
                onClick={() => {
                    if (valider()) {
                        reset();
                        setÅpen(true);
                    }
                }}
            >
                {'Send til beslutter'}
            </Button>

            <Dialog open={åpen} onOpenChange={setÅpen}>
                <Dialog.Popup>
                    <Dialog.Header>
                        <strong>{'Send vedtaket til beslutning?'}</strong>
                    </Dialog.Header>

                    <Dialog.Body>
                        <BehandlingValideringVarsler resultat={valideringResultat} />

                        {error && (
                            <Infokort
                                variant={'feil'}
                                header={'Feil ved send til beslutning'}
                            >{`Feil: ${error.message} (kode ${error.status})`}</Infokort>
                        )}
                    </Dialog.Body>

                    <Dialog.Footer>
                        <Button
                            variant={'primary'}
                            icon={<ArrowRightIcon />}
                            loading={isMutating}
                            onClick={sendTilBeslutning}
                        >
                            {'Send til beslutning'}
                        </Button>

                        <Dialog.CloseTrigger>
                            <Button variant={'secondary'}>{'Avbryt'}</Button>
                        </Dialog.CloseTrigger>
                    </Dialog.Footer>
                </Dialog.Popup>
            </Dialog>
        </>
    );
};
