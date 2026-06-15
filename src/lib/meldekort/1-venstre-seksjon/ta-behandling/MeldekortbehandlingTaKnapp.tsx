import { Alert, Button, Loader } from '@navikt/ds-react';
import { useRef } from 'react';
import { BekreftelsesModal } from '~/lib/_felles/modaler/BekreftelsesModal';
import { useSak } from '~/lib/sak/SakContext';
import { MeldekortbehandlingProps } from '~/lib/meldekort/typer/Meldekortbehandling';
import { useTaMeldekortbehandling } from '~/lib/meldekort/api/MeldekortApi';

import styles from './MeldekortbehandlingTaKnapp.module.css';

type Props = {
    meldekortbehandling: MeldekortbehandlingProps;
};

export const MeldekortbehandlingTaKnapp = ({ meldekortbehandling }: Props) => {
    const { sak, setSak } = useSak();

    const { trigger, isMutating, error } = useTaMeldekortbehandling({
        sakId: sak.sakId,
        meldekortbehandlingId: meldekortbehandling.id,
    });

    const modalRef = useRef<HTMLDialogElement>(null);
    const lukkModal = () => modalRef.current?.close();

    return (
        <div>
            {error && (
                <Alert variant={'error'} className={styles.varsel}>
                    {error.message}
                </Alert>
            )}
            <Button onClick={() => modalRef.current?.showModal()} className={styles.knapp}>
                {'Ta behandling'}
            </Button>
            <BekreftelsesModal
                modalRef={modalRef}
                tittel={'Ta meldekortbehandling'}
                feil={error}
                lukkModal={lukkModal}
                bekreftKnapp={
                    <Button
                        icon={isMutating && <Loader />}
                        disabled={isMutating}
                        onClick={() => {
                            trigger().then((oppdaterSak) => {
                                if (oppdaterSak) {
                                    setSak(oppdaterSak);
                                    lukkModal();
                                }
                            });
                        }}
                    >
                        {'Ta behandling'}
                    </Button>
                }
            >
                {'Vil du ta denne meldekortbehandlingen?'}
            </BekreftelsesModal>
        </div>
    );
};
