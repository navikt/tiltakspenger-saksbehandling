import { Alert, BodyShort, Button, HStack, Spacer } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { useSak } from '../../../../layout/SakLayout';
import { useSendMeldekortTilBeslutter } from '../../../../../hooks/meldekort/useSendMeldekortTilBeslutter';
import { MeldekortBehandlingUke } from './MeldekortBehandlingUke';
import BekreftelsesModal from '../../../../bekreftelsesmodal/BekreftelsesModal';
import {
    hentMeldekortBehandlingDager,
    MeldekortBehandlingForm,
    tellDagerMedDeltattEllerFravær,
} from './meldekortBehandlingUtils';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useHentMeldeperiodeKjede } from '../../../../../hooks/meldekort/useHentMeldeperiodeKjede';
import { MeldeperiodeMedBehandlingProps } from '../../../../../types/meldekort/Meldeperiode';

import styles from '../../Meldekort.module.css';

type Props = {
    meldeperiode: MeldeperiodeMedBehandlingProps;
};

export const MeldekortBehandling = ({ meldeperiode }: Props) => {
    const { meldekortBehandling, brukersMeldekort, antallDager } = meldeperiode;
    const { sakId } = useSak();
    const { revalider } = useHentMeldeperiodeKjede(meldeperiode.kjedeId, sakId);

    const [valideringsFeil, setValideringsFeil] = useState('');

    const modalRef = useRef<HTMLDialogElement>(null);

    const dagerDefault = hentMeldekortBehandlingDager(meldekortBehandling, brukersMeldekort);

    const formMethods = useForm<MeldekortBehandlingForm>({
        mode: 'onSubmit',
        defaultValues: {
            uke1: dagerDefault.slice(0, 7),
            uke2: dagerDefault.slice(7, 14),
        },
    });

    const {
        sendMeldekortTilBeslutter,
        senderMeldekortTilBeslutter,
        feilVedSendingTilBeslutter,
        reset,
    } = useSendMeldekortTilBeslutter({
        meldekortId: meldekortBehandling.id,
        sakId,
        onSuccess: () => {
            lukkModal();
            revalider();
        },
    });

    const lukkModal = () => {
        modalRef.current?.close();
        reset();
    };

    const validerOgÅpneBekreftelse: SubmitHandler<MeldekortBehandlingForm> = (form) => {
        if (tellDagerMedDeltattEllerFravær([...form.uke1, ...form.uke2]) > antallDager) {
            setValideringsFeil(
                `For mange dager utfylt - Maks ${antallDager} dager med tiltak for denne perioden.`,
            );
            return;
        }

        setValideringsFeil('');
        modalRef.current?.showModal();
    };

    return (
        <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(validerOgÅpneBekreftelse)}>
                <HStack className={styles.meldekort}>
                    <MeldekortBehandlingUke dager={formMethods.getValues().uke1} ukenummer={1} />
                    <Spacer />
                    <MeldekortBehandlingUke dager={formMethods.getValues().uke2} ukenummer={2} />
                </HStack>
                {valideringsFeil && (
                    <Alert variant={'error'}>
                        <BodyShort weight={'semibold'}>{'Feil i utfyllingen'}</BodyShort>
                        <BodyShort>{valideringsFeil}</BodyShort>
                    </Alert>
                )}
                <Button type="submit" value="submit" size="small" style={{ marginTop: '2.5rem' }}>
                    Send til beslutter
                </Button>
                <BekreftelsesModal
                    modalRef={modalRef}
                    tittel={'Send meldekort til beslutter'}
                    body={
                        'Er du sikker på at meldekortet er ferdig utfylt og klart til å sendes til beslutter?'
                    }
                    error={feilVedSendingTilBeslutter}
                    lukkModal={lukkModal}
                >
                    <Button
                        size="small"
                        loading={senderMeldekortTilBeslutter}
                        onClick={() =>
                            sendMeldekortTilBeslutter({
                                dager: formMethods
                                    .getValues()
                                    .uke1.concat(formMethods.getValues().uke2),
                            })
                        }
                    >
                        Send til beslutter
                    </Button>
                </BekreftelsesModal>
            </form>
        </FormProvider>
    );
};
