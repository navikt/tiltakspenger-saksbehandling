import { Alert, Button, Loader } from '@navikt/ds-react';
import { MeldeperiodeProps, MeldeperiodeStatus } from '../../../../types/meldekort/Meldeperiode';
import { useOpprettMeldekortBehandling } from '../../hooks/useOpprettMeldekortBehandling';
import { BekreftelsesModal } from '../../../modaler/BekreftelsesModal';
import { useRef } from 'react';
import { useSak } from '../../../../context/sak/SakContext';
import { useMeldeperiodeKjede } from '../../hooks/useMeldeperiodeKjede';

import styles from './MeldekortBehandlingOpprett.module.css';

type Props = {
    meldeperiode: MeldeperiodeProps;
};

export const MeldekortBehandlingOpprett = ({ meldeperiode }: Props) => {
    const { sakId } = useSak().sak;
    const { setMeldekortbehandling } = useMeldeperiodeKjede();

    const { opprett, laster, feil } = useOpprettMeldekortBehandling({
        kjedeId: meldeperiode.kjedeId,
        sakId,
    });

    const modalRef = useRef<HTMLDialogElement>(null);

    return (
        <div>
            {meldeperiode.status === MeldeperiodeStatus.IKKE_RETT_TIL_TILTAKSPENGER ? (
                <Alert variant={'info'}>{'Ikke rett til tiltakspenger for denne perioden'}</Alert>
            ) : (
                <Button onClick={() => modalRef.current?.showModal()} className={styles.knapp}>
                    {'Start behandling'}
                </Button>
            )}
            {feil && <Alert variant={'error'}>{feil.message}</Alert>}
            <BekreftelsesModal
                modalRef={modalRef}
                tittel={'Start behandling av meldekortet'}
                feil={feil}
                lukkModal={() => modalRef.current?.close()}
                bekreftKnapp={
                    <Button
                        icon={laster && <Loader />}
                        disabled={laster}
                        onClick={() => {
                            opprett().then((meldekortBehandling) => {
                                if (meldekortBehandling) {
                                    setMeldekortbehandling(meldeperiode.id, meldekortBehandling);
                                }
                            });
                        }}
                    >
                        {'Start behandling'}
                    </Button>
                }
            >
                {'Vil du starte behandling av dette meldekortet?'}
            </BekreftelsesModal>
        </div>
    );
};
