import { Alert, Button, Loader } from '@navikt/ds-react';
import { MeldeperiodeProps, MeldeperiodeStatus } from '../../../../types/meldekort/Meldeperiode';
import { useOpprettMeldekortBehandling } from '../../../../hooks/meldekort/useOpprettMeldekortBehandling';
import { useHentMeldeperiodeKjede } from '../../../../hooks/meldekort/useHentMeldeperiodeKjede';
import BekreftelsesModal from '../../../modaler/BekreftelsesModal';
import { useRef } from 'react';
import { useSak } from '../../../../context/sak/useSak';

import styles from './MeldekortBehandlingOpprett.module.css';

type Props = {
    meldeperiode: MeldeperiodeProps;
};

export const MeldekortBehandlingOpprett = ({ meldeperiode }: Props) => {
    const { sakId } = useSak().sak;
    const { revalider } = useHentMeldeperiodeKjede(meldeperiode.kjedeId, sakId);
    const { opprett, laster, feil } = useOpprettMeldekortBehandling({
        kjedeId: meldeperiode.kjedeId,
        sakId,
        onSuccess: revalider,
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
            {feil && <Alert variant={'error'}>{feil}</Alert>}
            <BekreftelsesModal
                modalRef={modalRef}
                tittel={'Start behandling av meldekortet'}
                body={'Vil du starte behandling av dette meldekortet?'}
                error={feil}
                lukkModal={() => modalRef.current?.close()}
            >
                <Button
                    icon={laster && <Loader />}
                    onClick={() => {
                        console.log('Oppretter behandling');
                        opprett();
                    }}
                >
                    {'Start behandling'}
                </Button>
            </BekreftelsesModal>
        </div>
    );
};
