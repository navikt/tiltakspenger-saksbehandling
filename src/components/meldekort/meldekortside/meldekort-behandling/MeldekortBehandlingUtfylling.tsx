import { Button, HStack, Spacer } from '@navikt/ds-react';
import router from 'next/router';
import { useContext, useRef } from 'react';
import { SakContext } from '../../../layout/SakLayout';
import {
    MeldekortBehandlingProps,
    MeldekortDagDTO,
    MeldekortBehandlingDagStatus,
    MeldeperiodeKjedeProps,
} from '../../../../types/MeldekortTypes';
import { useSendMeldekortTilBeslutter } from '../../../../hooks/meldekort/useSendMeldekortTilBeslutter';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import Meldekortuke from '../Meldekortuke';
import { ukeHeading } from '../../../../utils/date';
import { kanSaksbehandleForBehandling } from '../../../../utils/tilganger';
import { SaksbehandlerContext } from '../../../../pages/_app';
import BekreftelsesModal from '../../../bekreftelsesmodal/BekreftelsesModal';
import { useMeldeperioder } from '../../../../hooks/meldekort/meldeperioder-context/useMeldeperioder';

import styles from '../Meldekort.module.css';

export interface Meldekortform {
    uke1: MeldekortDagDTO[];
    uke2: MeldekortDagDTO[];
}

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
};

export const MeldekortBehandlingUtfylling = ({ meldekortBehandling }: Props) => {
    const { meldeperiodeKjede } = useMeldeperioder();
    const { sakId } = useContext(SakContext);

    const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);
    const {
        sendMeldekortTilBeslutter,
        senderMeldekortTilBeslutter,
        feilVedSendingTilBeslutter,
        reset,
    } = useSendMeldekortTilBeslutter(meldekortBehandling.id, sakId);

    const modalRef = useRef(null);

    const lukkModal = () => {
        modalRef.current.close();
        reset();
    };

    //B: Må endre denne til å ta inn saksbehandler på meldekortet når vi har lagt til tildeling.
    const kanSaksbehandle = kanSaksbehandleForBehandling(
        meldekortBehandling.status,
        innloggetSaksbehandler,
        innloggetSaksbehandler.navIdent,
    );

    const meldekortdager = meldekortBehandling.dager.map((dag) => ({
        dato: dag.dato,
        status: dag.status === MeldekortBehandlingDagStatus.IkkeUtfylt ? '' : dag.status,
    }));

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
