import { Button } from '@navikt/ds-react';
import { BehandlingData } from '~/types/BehandlingTypes';
import { useGjenopptaBehandling } from '~/components/behandlingmeny/useGjenopptaBehandling';
import router from 'next/router';
import { BekreftelsesModal } from '~/components/modaler/BekreftelsesModal';
import { useRef } from 'react';

type Props = {
    behandling: BehandlingData;
};

export const BehandlingGjenoppta = ({ behandling }: Props) => {
    const { gjenopptaBehandling, isGjennopptaBehandlingMutating, gjenopptaBehandlingError } =
        useGjenopptaBehandling(behandling.sakId, behandling.id);

    const modalRef = useRef<HTMLDialogElement>(null);

    const lukkModal = () => modalRef.current?.close();
    const visModal = () => modalRef.current?.showModal();

    return (
        <>
            <Button onClick={visModal}>{'Gjenoppta behandling'}</Button>
            <BekreftelsesModal
                modalRef={modalRef}
                tittel={'Gjenoppta behandling?'}
                feil={gjenopptaBehandlingError}
                lukkModal={lukkModal}
                bekreftKnapp={
                    <Button
                        variant={'primary'}
                        loading={isGjennopptaBehandlingMutating}
                        onClick={(e) => {
                            e.preventDefault();
                            gjenopptaBehandling().then((oppdaterBehandling) => {
                                if (oppdaterBehandling) {
                                    lukkModal();
                                    router.push(`/behandling/${oppdaterBehandling.id}`);
                                }
                            });
                        }}
                    >
                        {'Gjenoppta behandling'}
                    </Button>
                }
            />
        </>
    );
};
