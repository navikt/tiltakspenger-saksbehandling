import { Alert, Button, HStack } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { BehandlingData } from '../../../types/BehandlingTypes';
import { FetcherError } from '../../../utils/fetch/fetch';
import { useBehandling } from '../BehandlingContext';
import { SaksbehandlerRolle } from '../../../types/Saksbehandler';
import { BekreftelsesModal } from '../../modaler/BekreftelsesModal';

import style from './BehandlingSendOgGodkjenn.module.css';
import Underkjenn from '../../underkjenn/Underkjenn';
import { useFetchJsonFraApi } from '../../../utils/fetch/useFetchFraApi';
import router from 'next/router';

type Props = {
    godkjenn: () => Promise<BehandlingData | undefined>;
    laster: boolean;
    error?: FetcherError;
};

export const BehandlingGodkjenn = ({ godkjenn, laster, error }: Props) => {
    const [harGodkjent, setHarGodkjent] = useState(false);
    const modalRef = useRef<HTMLDialogElement>(null);

    const { setBehandling, rolleForBehandling, behandling } = useBehandling();

    const lukkModal = () => modalRef.current?.close();

    const underkjennApi = useFetchJsonFraApi<BehandlingData, { begrunnelse: string }>(
        `/behandling/sendtilbake/${behandling.id}`,
        'POST',
        {
            onSuccess: (oppdatertBehandling) => {
                setBehandling(oppdatertBehandling!);
                router.push(`/sak/${oppdatertBehandling!.saksnummer}`);
            },
        },
    );

    return (
        <div className={style.wrapper}>
            {rolleForBehandling === SaksbehandlerRolle.BESLUTTER && (
                <HStack gap="2">
                    <Underkjenn
                        onUnderkjenn={{
                            click: (begrunnelse) => underkjennApi.trigger({ begrunnelse }),
                            pending: underkjennApi.isMutating,
                            error: underkjennApi.error,
                        }}
                    />
                    <Button onClick={() => modalRef.current?.showModal()}>
                        {'Godkjenn vedtaket'}
                    </Button>
                </HStack>
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
