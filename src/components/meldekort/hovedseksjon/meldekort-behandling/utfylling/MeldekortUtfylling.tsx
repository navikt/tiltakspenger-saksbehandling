import { Alert, BodyLong, BodyShort, Button, Heading, Textarea } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { useSak } from '../../../../../context/sak/SakContext';
import { useSendMeldekortTilBeslutter } from '../../../hooks/useSendMeldekortTilBeslutter';
import { BekreftelsesModal } from '../../../../modaler/BekreftelsesModal';
import {
    hentMeldekortForhåndsutfylling,
    MeldekortBehandlingForm,
    tellDagerMedDeltattEllerFravær,
} from './meldekortUtfyllingUtils';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMeldeperiodeKjede } from '../../../context/MeldeperiodeKjedeContext';
import { MeldekortBehandlingProps } from '../../../../../types/meldekort/MeldekortBehandling';
import { MeldekortUker } from '../../uker/MeldekortUker';

import styles from './MeldekortUtfylling.module.css';

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
};

export const MeldekortUtfylling = ({ meldekortBehandling }: Props) => {
    const {
        setMeldeperiodeKjede,
        meldeperiodeKjede,
        sisteMeldeperiode,
        tidligereMeldekortBehandlinger,
    } = useMeldeperiodeKjede();

    const { sakId } = useSak().sak;

    const [valideringsFeil, setValideringsFeil] = useState('');

    const { antallDager } = sisteMeldeperiode;
    const { brukersMeldekort } = meldeperiodeKjede;

    const modalRef = useRef<HTMLDialogElement>(null);

    const dagerDefault = hentMeldekortForhåndsutfylling(
        meldekortBehandling,
        tidligereMeldekortBehandlinger,
        brukersMeldekort,
    );

    const formMethods = useForm<MeldekortBehandlingForm>({
        mode: 'onSubmit',
        defaultValues: {
            dager: dagerDefault,
            begrunnelse: undefined,
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
        },
    });

    const lukkModal = () => {
        modalRef.current?.close();
        reset();
    };

    const validerOgÅpneBekreftelse: SubmitHandler<MeldekortBehandlingForm> = (form) => {
        if (tellDagerMedDeltattEllerFravær(form.dager) > antallDager) {
            setValideringsFeil(
                `For mange dager utfylt - Maks ${antallDager} dager med tiltak for denne perioden.`,
            );
            return;
        }

        setValideringsFeil('');
        modalRef.current?.showModal();
    };

    return (
        <form onSubmit={formMethods.handleSubmit(validerOgÅpneBekreftelse)}>
            <MeldekortUker
                dager={formMethods.getValues().dager}
                formContext={formMethods}
                className={styles.uker}
            />
            <Heading size={'xsmall'} level={'2'} className={styles.header}>
                {'Begrunnelse (valgfri)'}
            </Heading>
            <BodyLong size={'small'} className={styles.personinfoVarsel}>
                {'Ikke skriv personsensitiv informasjon som ikke er relevant for saken.'}
            </BodyLong>
            <Textarea
                label={'Begrunnelse'}
                hideLabel={true}
                minRows={5}
                resize={'vertical'}
                onChange={(event) => {
                    formMethods.setValue('begrunnelse', event.target.value);
                }}
            />
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
                feil={feilVedSendingTilBeslutter}
                lukkModal={lukkModal}
                bekreftKnapp={
                    <Button
                        size={'small'}
                        loading={senderMeldekortTilBeslutter}
                        onClick={() =>
                            sendMeldekortTilBeslutter({
                                dager: formMethods.getValues().dager,
                                begrunnelse: formMethods.getValues().begrunnelse,
                            }).then((oppdatertKjede) => {
                                if (oppdatertKjede) {
                                    setMeldeperiodeKjede(oppdatertKjede);
                                    lukkModal();
                                }
                            })
                        }
                    >
                        {'Send til beslutter'}
                    </Button>
                }
            >
                {
                    'Er du sikker på at meldekortet er ferdig utfylt og klart til å sendes til beslutter?'
                }
            </BekreftelsesModal>
        </form>
    );
};
