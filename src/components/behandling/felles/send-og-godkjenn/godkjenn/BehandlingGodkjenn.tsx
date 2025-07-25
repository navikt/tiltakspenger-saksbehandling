import { Alert, Button, HStack } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { BehandlingData } from '~/types/BehandlingTypes';
import { useBehandling } from '../../../BehandlingContext';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { BekreftelsesModal } from '../../../../modaler/BekreftelsesModal';
import Underkjenn from '../../../../underkjenn/Underkjenn';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import router from 'next/router';
import { useGodkjennBehandling } from '~/components/behandling/felles/send-og-godkjenn/godkjenn/useGodkjennBehandling';
import { useRolleForBehandling } from '~/context/saksbehandler/SaksbehandlerContext';

import style from '../BehandlingSendOgGodkjenn.module.css';

type Props = {
    behandling: BehandlingData;
};

export const BehandlingGodkjenn = ({ behandling }: Props) => {
    const [harGodkjent, setHarGodkjent] = useState(false);
    const modalRef = useRef<HTMLDialogElement>(null);

    const { setBehandling } = useBehandling();

    const lukkModal = () => modalRef.current?.close();

    const { godkjennBehandling, godkjennBehandlingLaster, godkjennBehandlingError } =
        useGodkjennBehandling(behandling);

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

    const rolle = useRolleForBehandling(behandling);

    return (
        <div className={style.wrapper}>
            {rolle === SaksbehandlerRolle.BESLUTTER && (
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
                feil={godkjennBehandlingError}
                lukkModal={lukkModal}
                bekreftKnapp={
                    <Button
                        variant={'primary'}
                        loading={godkjennBehandlingLaster}
                        onClick={() => {
                            godkjennBehandling().then((oppdatertBehandling) => {
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
