import { Alert, Button, Loader } from '@navikt/ds-react';
import { MeldeperiodeProps, MeldeperiodeStatus } from '../../../../types/meldekort/Meldeperiode';
import { useOpprettMeldekortBehandling } from '../../../../hooks/meldekort/useOpprettMeldekortBehandling';
import { useSak } from '../../../layout/SakLayout';
import { useHentMeldeperiodeKjede } from '../../../../hooks/meldekort/useHentMeldeperiodeKjede';
import BekreftelsesModal from '../../../bekreftelsesmodal/BekreftelsesModal';
import { useRef } from 'react';

import styles from './MeldekortBehandlingOpprett.module.css';

type Props = {
    meldeperiode: MeldeperiodeProps;
};

export const MeldekortBehandlingOpprett = ({ meldeperiode }: Props) => {
    const { sakId } = useSak();
    const { revalider } = useHentMeldeperiodeKjede(meldeperiode.kjedeId, sakId);
    const { opprett, laster, feil } = useOpprettMeldekortBehandling({
        meldeperiodeId: meldeperiode.id,
        sakId,
        onSuccess: revalider,
    });

    const modalRef = useRef(null);

    return (
        <div>
            {meldeperiode.status === MeldeperiodeStatus.IKKE_RETT_TIL_TILTAKSPENGER ? (
                <Alert variant={'info'}>{'Ikke rett til tiltakspenger for denne perioden'}</Alert>
            ) : (
                <Button onClick={() => modalRef.current.showModal()} className={styles.knapp}>
                    {'Start behandling'}
                </Button>
            )}
            {feil && <Alert variant={'error'}>{feil}</Alert>}
            <BekreftelsesModal
                modalRef={modalRef}
                tittel={'Start behandling av meldekortet'}
                body={'Vil du starte behandling av dette meldekortet?'}
                error={feil}
                lukkModal={() => modalRef.current.close()}
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
