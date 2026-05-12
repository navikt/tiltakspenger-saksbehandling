import { Alert, Button, Loader } from '@navikt/ds-react';
import { useRef } from 'react';
import { BekreftelsesModal } from '~/lib/_felles/modaler/BekreftelsesModal';
import { useSak } from '~/lib/sak/SakContext';
import { useMeldeperiodeKjede } from '../../context/MeldeperiodeKjedeContext';
import { useTaMeldekortbehandling } from '~/lib/personoversikt/meldekort-oversikt/useTaMeldekortbehandling';
import { MeldekortbehandlingProps } from '~/lib/meldekort/typer/Meldekortbehandling';

import styles from './MeldekortbehandlingTaKnapp.module.css';

type Props = {
    meldekortbehandling: MeldekortbehandlingProps;
};

export const MeldekortbehandlingTaKnapp = ({ meldekortbehandling }: Props) => {
    const { sakId } = useSak().sak;

    const { meldeperiodeKjede, setMeldeperiodeKjede } = useMeldeperiodeKjede();

    const { taMeldekortbehandling, isMeldekortbehandlingMutating, taMeldekortbehandlingError } =
        useTaMeldekortbehandling(sakId, meldekortbehandling.id);

    const modalRef = useRef<HTMLDialogElement>(null);
    const lukkModal = () => modalRef.current?.close();

    return (
        <div>
            {taMeldekortbehandlingError && (
                <Alert variant={'error'} className={styles.varsel}>
                    {taMeldekortbehandlingError.message}
                </Alert>
            )}
            <Button onClick={() => modalRef.current?.showModal()} className={styles.knapp}>
                {'Ta behandling'}
            </Button>
            <BekreftelsesModal
                modalRef={modalRef}
                tittel={'Ta meldekortbehandling'}
                feil={taMeldekortbehandlingError}
                lukkModal={lukkModal}
                bekreftKnapp={
                    <Button
                        icon={isMeldekortbehandlingMutating && <Loader />}
                        disabled={isMeldekortbehandlingMutating}
                        onClick={() => {
                            taMeldekortbehandling().then((oppdatertBehandling) => {
                                if (oppdatertBehandling) {
                                    setMeldeperiodeKjede({
                                        ...meldeperiodeKjede,
                                        meldekortbehandlinger:
                                            meldeperiodeKjede.meldekortbehandlinger.map((mbeh) =>
                                                mbeh.id === oppdatertBehandling.id
                                                    ? oppdatertBehandling
                                                    : mbeh,
                                            ),
                                    });
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
