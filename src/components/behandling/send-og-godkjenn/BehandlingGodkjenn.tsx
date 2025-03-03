import { Alert, Button } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { BehandlingData } from '../../../types/BehandlingTypes';
import { FetcherError } from '../../../utils/fetch/fetch';
import { useBehandling } from '../BehandlingContext';
import { SaksbehandlerRolle } from '../../../types/Saksbehandler';
import { BekreftelsesModal } from '../../modaler/BekreftelsesModal';

import style from './BehandlingSendOgGodkjenn.module.css';

type Props = {
    godkjenn: () => Promise<BehandlingData | undefined>;
    laster: boolean;
    error?: FetcherError;
};

export const BehandlingGodkjenn = ({ godkjenn, laster, error }: Props) => {
    const [harGodkjent, setHarGodkjent] = useState(false);
    const modalRef = useRef<HTMLDialogElement>(null);

    const { setBehandling, rolleForBehandling } = useBehandling();

    const lukkModal = () => modalRef.current?.close();

    return (
        <div className={style.wrapper}>
            {rolleForBehandling === SaksbehandlerRolle.BESLUTTER && (
                <Button onClick={() => modalRef.current?.showModal()}>{'Godkjenn vedtaket'}</Button>
            )}
            {harGodkjent && (
                <Alert variant={'success'} className={style.success}>
                    {'Vedtaket er godkjent'}
                </Alert>
            )}
            <BekreftelsesModal
                modalRef={modalRef}
                tittel={'Godkjenn vedtaket?'}
                feil={error}
                lukkModal={lukkModal}
                bekreftKnapp={
                    <Button
                        variant={'primary'}
                        loading={laster}
                        onClick={() => {
                            godkjenn().then((oppdatertBehandling) => {
                                if (oppdatertBehandling) {
                                    setHarGodkjent(true);
                                    setBehandling(oppdatertBehandling);
                                    lukkModal();
                                }
                            });
                        }}
                    >
                        {'Godkjenn vedtaket'}
                    </Button>
                }
            />
        </div>
    );
};
