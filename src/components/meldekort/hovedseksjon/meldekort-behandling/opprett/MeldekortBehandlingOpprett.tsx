import { Alert, Button, Loader } from '@navikt/ds-react';
import { useOpprettMeldekortBehandling } from '../../../hooks/useOpprettMeldekortBehandling';
import { BekreftelsesModal } from '../../../../modaler/BekreftelsesModal';
import { useRef } from 'react';
import { useSak } from '../../../../../context/sak/SakContext';
import { useMeldeperiodeKjede } from '../../../context/MeldeperiodeKjedeContext';
import { MeldekortBehandlingType } from '../../../../../types/meldekort/MeldekortBehandling';
import { MeldeperiodeKjedeStatus } from '../../../../../types/meldekort/Meldeperiode';

import styles from './MeldekortBehandlingOpprett.module.css';

type Props = {
    type: MeldekortBehandlingType;
};

export const MeldekortBehandlingOpprett = ({ type }: Props) => {
    const { sakId } = useSak().sak;
    const { oppdaterMeldekortBehandling, meldeperiodeKjede } = useMeldeperiodeKjede();

    const { id: kjedeId, status: kjedeStatus, sakHarMeldekortUnderBehandling } = meldeperiodeKjede;

    const { opprett, laster, feil } = useOpprettMeldekortBehandling({
        kjedeId,
        sakId,
    });

    const tekster = teksterForType[type];

    const modalRef = useRef<HTMLDialogElement>(null);

    const lukkModal = () => modalRef.current?.close();

    return (
        <div>
            {feil && (
                <Alert variant={'error'} className={styles.varsel}>
                    {feil.message}
                </Alert>
            )}
            {kjedeStatus === MeldeperiodeKjedeStatus.IKKE_RETT_TIL_TILTAKSPENGER ? (
                <Alert variant={'info'} className={styles.varsel}>
                    {'Ikke rett til tiltakspenger for denne perioden'}
                </Alert>
            ) : (
                <>
                    {sakHarMeldekortUnderBehandling && (
                        <Alert variant={'warning'} inline={true} className={styles.varsel}>
                            {tekster.kanIkkeStarte}
                        </Alert>
                    )}
                    <Button
                        disabled={sakHarMeldekortUnderBehandling}
                        onClick={() => modalRef.current?.showModal()}
                        className={styles.knapp}
                    >
                        {tekster.start}
                    </Button>
                </>
            )}
            <BekreftelsesModal
                modalRef={modalRef}
                tittel={tekster.modalTittel}
                feil={feil}
                lukkModal={lukkModal}
                bekreftKnapp={
                    <Button
                        icon={laster && <Loader />}
                        disabled={laster}
                        onClick={() => {
                            opprett().then((meldekortBehandling) => {
                                if (meldekortBehandling) {
                                    oppdaterMeldekortBehandling(meldekortBehandling);
                                    lukkModal();
                                }
                            });
                        }}
                    >
                        {tekster.start}
                    </Button>
                }
            >
                {tekster.modalTekst}
            </BekreftelsesModal>
        </div>
    );
};

const teksterForType = {
    [MeldekortBehandlingType.FØRSTE_BEHANDLING]: {
        start: 'Start behandling',
        kanIkkeStarte:
            'Kan ikke starte behandling av meldekortet - Det finnes allerede en åpen meldekortbehandling på denne saken',
        modalTittel: 'Start behandling av meldekortet',
        modalTekst: 'Vil du starte behandling av dette meldekortet?',
    },
    [MeldekortBehandlingType.KORRIGERING]: {
        start: 'Start korrigering',
        kanIkkeStarte:
            'Kan ikke starte korrigering av meldekortet - Det finnes allerede en åpen meldekortbehandling på denne saken',
        modalTittel: 'Start korrigering av meldekortet',
        modalTekst: 'Vil du starte korrigering av dette meldekortet?',
    },
} as const satisfies Record<MeldekortBehandlingType, Record<string, string>>;
