import { Button, HStack, Spacer } from '@navikt/ds-react';
import { useRef } from 'react';
import { useSak } from '../../../layout/SakLayout';
import {
    MeldekortBehandlingProps,
    MeldekortBehandlingDag,
    BrukersMeldekortProps,
} from '../../../../types/MeldekortTypes';
import { useSendMeldekortTilBeslutter } from '../../../../hooks/meldekort/useSendMeldekortTilBeslutter';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import Meldekortuke from '../Meldekortuke';
import { ukeHeading } from '../../../../utils/date';
import { kanSaksbehandleMeldekort } from '../../../../utils/tilganger';
import BekreftelsesModal from '../../../bekreftelsesmodal/BekreftelsesModal';
import { useMeldeperioder } from '../../../../hooks/meldekort/useMeldeperioder';
import { useRouter } from 'next/router';
import { useSaksbehandler } from '../../../../hooks/useSaksbehandler';

import styles from '../Meldekort.module.css';
import { hentUtfylteMeldekortDager } from './hentUtfylteMeldekortDager';

interface Meldekortform {
    uke1: MeldekortBehandlingDag[];
    uke2: MeldekortBehandlingDag[];
}

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
    brukersMeldekort?: BrukersMeldekortProps;
};

export const MeldekortBehandlingUtfylling = ({ meldekortBehandling, brukersMeldekort }: Props) => {
    const { meldeperiodeKjede } = useMeldeperioder();
    const { sakId } = useSak();
    const { innloggetSaksbehandler } = useSaksbehandler();

    const router = useRouter();

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
            router.reload();
        },
    });

    const modalRef = useRef(null);

    const lukkModal = () => {
        modalRef.current.close();
        reset();
    };

    const kanSaksbehandle = kanSaksbehandleMeldekort(
        meldekortBehandling.status,
        innloggetSaksbehandler,
        innloggetSaksbehandler.navIdent,
    );

    const meldekortdager = hentUtfylteMeldekortDager(meldekortBehandling, brukersMeldekort);

    const methods = useForm<Meldekortform>({
        mode: 'onSubmit',
        defaultValues: {
            uke1: meldekortdager.slice(0, 7),
            uke2: meldekortdager.slice(7, 14),
        },
    });

    const onSubmit: SubmitHandler<Meldekortform> = () => {
        modalRef.current?.showModal();
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <HStack className={styles.meldekort}>
                    <Meldekortuke
                        ukenummer={1}
                        meldekortdager={methods.getValues().uke1}
                        ukeHeading={ukeHeading(meldeperiodeKjede.periode.fraOgMed)}
                    />
                    <Spacer />
                    <Meldekortuke
                        ukenummer={2}
                        meldekortdager={methods.getValues().uke2}
                        ukeHeading={ukeHeading(meldeperiodeKjede.periode.tilOgMed)}
                    />
                </HStack>
                {kanSaksbehandle && (
                    <>
                        <Button
                            type="submit"
                            value="submit"
                            size="small"
                            style={{ marginTop: '2.5rem' }}
                        >
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
                                        dager: methods
                                            .getValues()
                                            .uke1.concat(methods.getValues().uke2),
                                    })
                                }
                            >
                                Send til beslutter
                            </Button>
                        </BekreftelsesModal>
                    </>
                )}
            </form>
        </FormProvider>
    );
};
