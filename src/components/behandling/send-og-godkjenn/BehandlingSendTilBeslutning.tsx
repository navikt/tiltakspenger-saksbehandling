import { Alert, Button, Heading } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { useBehandling } from '../BehandlingContext';
import { BehandlingData } from '../../../types/BehandlingTypes';
import { FetcherError } from '../../../utils/fetch/fetch';
import { SaksbehandlerRolle } from '../../../types/Saksbehandler';
import { BekreftelsesModal } from '../../modaler/BekreftelsesModal';
import { TekstListe } from '../../liste/TekstListe';

import style from './BehandlingSendOgGodkjenn.module.css';

export type ValideringResultat = {
    errors: string[];
    warnings: string[];
};

type Props = {
    send: () => Promise<BehandlingData | undefined>;
    laster: boolean;
    serverfeil?: FetcherError;
    validering: () => ValideringResultat;
};

export const BehandlingSendTilBeslutning = ({ send, laster, serverfeil, validering }: Props) => {
    const [harSendt, setHarSendt] = useState(false);
    const [valideringResultat, setValideringResultat] = useState<ValideringResultat>({
        errors: [],
        warnings: [],
    });

    const modalRef = useRef<HTMLDialogElement>(null);

    const { setBehandling, rolleForBehandling } = useBehandling();

    const åpneModal = () => {
        setValideringResultat(validering());
        modalRef.current?.showModal();
    };
    const lukkModal = () => modalRef.current?.close();

    const harValideringsfeil = valideringResultat.errors.length > 0;

    return (
        <div className={style.wrapper}>
            {rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER && (
                <Button onClick={åpneModal}>{'Send til beslutning'}</Button>
            )}
            {harSendt && (
                <Alert variant={'success'} className={style.success}>
                    {'Vedtaket ble sendt til beslutning'}
                </Alert>
            )}
            <BekreftelsesModal
                modalRef={modalRef}
                tittel={'Send vedtaket til beslutning?'}
                feil={serverfeil}
                lukkModal={lukkModal}
                bekreftKnapp={
                    <Button
                        variant={'primary'}
                        loading={laster}
                        disabled={harValideringsfeil}
                        onClick={() => {
                            send().then((oppdatertBehandling) => {
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
                    <Alert variant={'warning'} className={style.warning}>
                        <Heading size={'small'} level={'2'}>
                            {'Obs!'}
                        </Heading>
                        <TekstListe tekster={valideringResultat.warnings} />
                    </Alert>
                )}
                {harValideringsfeil && (
                    <Alert variant={'error'}>
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
