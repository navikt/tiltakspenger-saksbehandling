import { Button } from '@navikt/ds-react';
import router from 'next/router';
import { BekreftelsesModal } from '~/lib/_felles/modaler/BekreftelsesModal';
import { useRef } from 'react';
import { behandlingUrl } from '~/utils/urls';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

type Props = {
    behandling: Rammebehandling;
};

export const BehandlingGjenoppta = ({ behandling }: Props) => {
    const { sakId, id } = behandling;

    const {
        trigger: gjenopptaBehandling,
        isMutating: isGjennopptaBehandlingMutating,
        error: gjenopptaBehandlingError,
    } = useFetchJsonFraApi<Rammebehandling>(`/sak/${sakId}/behandling/${id}/gjenoppta`, 'POST');

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
                                    router.push(behandlingUrl(oppdaterBehandling));
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
