import { BekreftelsesModal } from '../../../../modaler/BekreftelsesModal';
import { Button } from '@navikt/ds-react';
import { useSendMeldekortTilBeslutter } from './useSendMeldekortTilBeslutter';
import {
    MeldekortBehandlingDTO,
    MeldekortBehandlingId,
} from '../../../../../types/meldekort/MeldekortBehandling';
import { SakId } from '../../../../../types/Sak';
import { useMeldeperiodeKjede } from '../../../MeldeperiodeKjedeContext';
import { useFormContext } from 'react-hook-form';
import { MeldekortBehandlingForm } from '../utfylling/meldekortUtfyllingUtils';
import { useNotification } from '~/context/NotificationContext';

type Props = {
    meldekortId: MeldekortBehandlingId;
    sakId: SakId;
    saksnummer: string;
    hentMeldekortUtfylling: () => MeldekortBehandlingDTO;
    modalRef: React.RefObject<HTMLDialogElement | null>;
};

export const MeldekortSendTilBeslutning = ({
    meldekortId,
    sakId,
    saksnummer,
    hentMeldekortUtfylling,
    modalRef,
}: Props) => {
    const { navigateWithNotification } = useNotification();

    const formContext = useFormContext<MeldekortBehandlingForm>();

    const { setMeldeperiodeKjede } = useMeldeperiodeKjede();

    const {
        sendMeldekortTilBeslutter,
        senderMeldekortTilBeslutter,
        feilVedSendingTilBeslutter,
        reset,
    } = useSendMeldekortTilBeslutter({ meldekortId, sakId });

    const lukkModal = () => {
        modalRef.current?.close();
        reset();
    };

    return (
        <>
            <Button
                size="small"
                onClick={() => {
                    formContext.trigger().then((isValid) => {
                        if (isValid) {
                            modalRef.current?.showModal();
                        }
                    });
                }}
            >
                {'Send til beslutter'}
            </Button>
            <BekreftelsesModal
                modalRef={modalRef}
                tittel={'Send meldekort til beslutter'}
                feil={feilVedSendingTilBeslutter}
                lukkModal={lukkModal}
                bekreftKnapp={
                    <Button
                        size={'small'}
                        type={'button'}
                        loading={senderMeldekortTilBeslutter}
                        onClick={() =>
                            sendMeldekortTilBeslutter(hentMeldekortUtfylling()).then(
                                (oppdatertKjede) => {
                                    if (oppdatertKjede) {
                                        setMeldeperiodeKjede(oppdatertKjede);
                                        navigateWithNotification(
                                            `/sak/${saksnummer}`,
                                            'Meldekortet er sendt til beslutter!',
                                        );
                                        lukkModal();
                                    }
                                },
                            )
                        }
                    >
                        {'Send til beslutter'}
                    </Button>
                }
            >
                Er du sikker på at meldekortet er ferdig utfylt og klart til å sendes til beslutter?
            </BekreftelsesModal>
        </>
    );
};
