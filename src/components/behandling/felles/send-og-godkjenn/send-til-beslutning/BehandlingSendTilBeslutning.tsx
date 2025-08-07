import { Button } from '@navikt/ds-react';
import { useRef } from 'react';
import { useBehandling } from '../../../BehandlingContext';
import { BehandlingData } from '~/types/BehandlingTypes';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { BekreftelsesModal } from '../../../../modaler/BekreftelsesModal';
import {
    useRolleForBehandling,
    useSaksbehandler,
} from '~/context/saksbehandler/SaksbehandlerContext';
import { useSendBehandlingTilBeslutning } from '~/components/behandling/felles/send-og-godkjenn/send-til-beslutning/useSendBehandlingTilBeslutning';
import { BehandlingVedtakDTO } from '~/types/VedtakTyper';
import { GjenopptaButton } from '~/components/behandling/felles/send-og-godkjenn/gjenoppta/GjenopptaButton';
import { skalKunneGjenopptaBehandling } from '~/utils/tilganger';
import { Nullable } from '~/types/UtilTypes';
import { useNotification } from '~/context/NotificationContext';

import style from '../BehandlingSendOgGodkjenn.module.css';

type Props = {
    behandling: BehandlingData;
    hentVedtakDto: () => Nullable<BehandlingVedtakDTO>;
    disabled: boolean;
};

export const BehandlingSendTilBeslutning = ({ behandling, hentVedtakDto, disabled }: Props) => {
    const { sendTilBeslutning, sendTilBeslutningLaster, sendTilBeslutningError } =
        useSendBehandlingTilBeslutning(behandling);
    const { navigateWithNotification } = useNotification();
    const { setBehandling } = useBehandling();
    const { innloggetSaksbehandler } = useSaksbehandler();
    const rolle = useRolleForBehandling(behandling);

    const modalRef = useRef<HTMLDialogElement>(null);

    const åpneModal = () => {
        modalRef.current?.showModal();
    };
    const lukkModal = () => modalRef.current?.close();

    return (
        <div className={style.wrapper}>
            {rolle === SaksbehandlerRolle.SAKSBEHANDLER && (
                <>
                    {skalKunneGjenopptaBehandling(behandling, innloggetSaksbehandler) ? (
                        <GjenopptaButton behandling={behandling} />
                    ) : (
                        <Button onClick={åpneModal} disabled={disabled}>
                            {'Send til beslutter'}
                        </Button>
                    )}
                </>
            )}
            <BekreftelsesModal
                modalRef={modalRef}
                tittel={'Send vedtaket til beslutning?'}
                feil={sendTilBeslutningError}
                lukkModal={lukkModal}
                bekreftKnapp={
                    <Button
                        variant={'primary'}
                        loading={sendTilBeslutningLaster}
                        onClick={() => {
                            const vedtakDto = hentVedtakDto();

                            if (!vedtakDto) {
                                return;
                            }

                            sendTilBeslutning(vedtakDto).then((oppdatertBehandling) => {
                                if (oppdatertBehandling) {
                                    setBehandling(oppdatertBehandling);
                                    navigateWithNotification(
                                        '/',
                                        'Vedtaket er sendt til beslutning!',
                                    );
                                    lukkModal();
                                }
                            });
                        }}
                    >
                        {'Send til beslutning'}
                    </Button>
                }
            />
        </div>
    );
};
