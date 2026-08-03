import { Button } from '@navikt/ds-react';
import { useState } from 'react';
import { useBehandling } from '../../../context/BehandlingContext';
import { BekreftelsesModal } from '~/lib/_felles/modaler/BekreftelsesModal';
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

export const BehandlingSendTilBeslutning = ({
    behandling,
    valider,
    valideringResultat,
    disabled,
}: Props) => {
    const { trigger, isMutating, error } = useFetchJsonFraApi<
        Rammebehandling,
        undefined,
        FetcherError<Rammebehandling>
    >(`/sak/${behandling.sakId}/behandling/${behandling.id}/sendtilbeslutning`, 'POST');

    const { navigateWithNotification } = useNotification();
    const { setBehandling } = useBehandling();

    const [visSendTilBeslutningModal, setVisSendTilBeslutningModal] = useState(false);

    return (
        <>
            <Button
                onClick={() => {
                    if (valider()) {
                        setVisSendTilBeslutningModal(true);
                    }
                }}
                disabled={disabled}
            >
                {'Send til beslutter'}
            </Button>
            <BekreftelsesModal
                åpen={visSendTilBeslutningModal}
                tittel={'Send vedtaket til beslutning?'}
                feil={error}
                lukkModal={() => setVisSendTilBeslutningModal(false)}
                bekreftKnapp={
                    <Button
                        variant={'primary'}
                        loading={isMutating}
                        onClick={() => {
                            trigger().then((oppdatertBehandling) => {
                                if (oppdatertBehandling) {
                                    setBehandling(oppdatertBehandling);
                                    navigateWithNotification(
                                        '/',
                                        'Vedtaket er sendt til beslutning!',
                                    );
                                    setVisSendTilBeslutningModal(false);
                                } else if (error?.data) {
                                    setBehandling(error.data);
                                }
                            });
                        }}
                    >
                        {'Send til beslutning'}
                    </Button>
                }
            >
                <BehandlingValideringVarsler resultat={valideringResultat} />
            </BekreftelsesModal>
        </>
    );
};
