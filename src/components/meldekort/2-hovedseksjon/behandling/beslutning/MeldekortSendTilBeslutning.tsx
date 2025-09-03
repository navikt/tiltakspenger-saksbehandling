import { BekreftelsesModal } from '../../../../modaler/BekreftelsesModal';
import { Button } from '@navikt/ds-react';
import { useSendMeldekortTilBeslutter } from './useSendMeldekortTilBeslutter';
import { useRef } from 'react';
import {
    MeldekortBehandlingDTO,
    MeldekortBehandlingId,
} from '../../../../../types/meldekort/MeldekortBehandling';
import { SakId } from '../../../../../types/SakTypes';
import { useMeldeperiodeKjede } from '../../../MeldeperiodeKjedeContext';
import { useFormContext } from 'react-hook-form';
import { MeldekortBehandlingForm } from '../utfylling/meldekortUtfyllingUtils';
import { useNotification } from '~/context/NotificationContext';

type Props = {
    meldekortId: MeldekortBehandlingId;
    sakId: SakId;
    saksnummer: string;
    hentMeldekortUtfylling: () => MeldekortBehandlingDTO;
    customValidering: () => boolean;
};

export const MeldekortSendTilBeslutning = ({
    meldekortId,
    sakId,
    saksnummer,
    hentMeldekortUtfylling,
    customValidering,
}: Props) => {
    const { navigateWithNotification } = useNotification();

    const formContext = useFormContext<MeldekortBehandlingForm>();

    const { setMeldeperiodeKjede } = useMeldeperiodeKjede();

    const modalRef = useRef<HTMLDialogElement>(null);

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
                type={'button'}
                onClick={() => {
                    formContext.trigger().then((isValid) => {
                        if (isValid && customValidering()) {
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
