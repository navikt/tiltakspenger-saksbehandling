import { Alert, Button, Heading } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { useBehandling } from '../../../BehandlingContext';
import { BehandlingData } from '~/types/BehandlingTypes';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { BekreftelsesModal } from '../../../../modaler/BekreftelsesModal';
import { TekstListe } from '../../../../liste/TekstListe';
import { ValideringResultat } from '~/types/Validering';
import { useRolleForBehandling } from '~/context/saksbehandler/SaksbehandlerContext';
import { useSendBehandlingTilBeslutning } from '~/components/behandling/felles/send-og-godkjenn/send-til-beslutning/useSendBehandlingTilBeslutning';
import { BehandlingVedtakDTO } from '~/types/VedtakTyper';

import style from '../BehandlingSendOgGodkjenn.module.css';
import { GjenopptaButton } from '~/components/behandling/felles/send-og-godkjenn/gjenoppta/GjenopptaButton';

type Props = {
    behandling: BehandlingData;
    hentVedtakDTO: () => BehandlingVedtakDTO;
    validering: () => ValideringResultat;
};

export const BehandlingSendTilBeslutning = ({ behandling, hentVedtakDTO, validering }: Props) => {
    const [harSendt, setHarSendt] = useState(false);
    const [valideringResultat, setValideringResultat] = useState<ValideringResultat>({
        errors: [],
        warnings: [],
    });

    const { sendTilBeslutning, sendTilBeslutningLaster, sendTilBeslutningError } =
        useSendBehandlingTilBeslutning(behandling);

    const { setBehandling } = useBehandling();
    const rolle = useRolleForBehandling(behandling);

    const modalRef = useRef<HTMLDialogElement>(null);

    const åpneModal = () => {
        setValideringResultat(validering());
        modalRef.current?.showModal();
    };
    const lukkModal = () => modalRef.current?.close();

    const harValideringsfeil = valideringResultat.errors.length > 0;

    return (
        <div className={style.wrapper}>
            {rolle === SaksbehandlerRolle.SAKSBEHANDLER && (
                <>
                    {behandling.sattPåVent.erSattPåVent ? (
                        <GjenopptaButton behandling={behandling} />
                    ) : (
                        <Button onClick={åpneModal}>{'Send til beslutter'}</Button>
                    )}
                </>
            )}
            {harSendt && (
                <Alert variant={'success'} className={style.success}>
                    {'Vedtaket ble sendt til beslutning'}
                </Alert>
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
                        disabled={harValideringsfeil}
                        onClick={() => {
                            sendTilBeslutning(hentVedtakDTO()).then((oppdatertBehandling) => {
                                if (oppdatertBehandling) {
                                    setHarSendt(true);
                                    setBehandling(oppdatertBehandling);
                                    lukkModal();
                                }
                            });
                        }}
                    >
                        {'Send til beslutning'}
                    </Button>
                }
            >
                {valideringResultat.warnings.length > 0 && (
                    <Alert variant={'warning'} className={style.warning} size={'small'}>
                        <Heading size={'small'} level={'2'}>
                            {'Obs!'}
                        </Heading>
                        <TekstListe tekster={valideringResultat.warnings} />
                    </Alert>
                )}
                {harValideringsfeil && (
                    <Alert variant={'error'} size={'small'}>
                        <Heading size={'small'} level={'2'}>
                            {'Feil i vedtaket'}
                        </Heading>
                        <TekstListe tekster={valideringResultat.errors} />
                    </Alert>
                )}
            </BekreftelsesModal>
        </div>
    );
};
